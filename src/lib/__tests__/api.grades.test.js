import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const API_URL = process.env.API_URL || 'https://testcinar26bknd.onrender.com/api';

async function api(method, path, data, token) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (token) options.headers.Authorization = `Bearer ${token}`;
  if (data) options.body = JSON.stringify(data);

  const res = await fetch(`${API_URL}${path}`, options);
  const json = await res.json();

  if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);

  return { status: res.status, body: json };
}

const TEST_USER = {
  username: `teststudent_${Date.now()}`,
  email: `teststudent_${Date.now()}@test.com`,
  password: 'TestPass123!',
  full_name: 'Test Student'
};

let studentToken;
let studentId;
let gradeId;

describe('Flujo completo: registro de evaluación para estudiante', () => {

  it('1. Registra un nuevo estudiante', async () => {
    const { status, body } = await api('POST', '/auth/register', TEST_USER);
    expect(status).toBe(201);
    expect(body.message).toBe('Usuario registrado exitosamente');
    expect(body.user).toBeDefined();
    expect(body.user.role).toBe('student');
    expect(body.token).toBeDefined();
    studentToken = body.token;
    studentId = body.user.id;
  });

  it('2. Inicia sesión con el estudiante creado', async () => {
    const { status, body } = await api('POST', '/auth/login', {
      username: TEST_USER.username,
      password: TEST_USER.password
    });
    expect(status).toBe(200);
    expect(body.message).toBe('Inicio de sesión exitoso');
    expect(body.token).toBeDefined();
    expect(body.user.id).toBe(studentId);
    studentToken = body.token;
  });

  it('3. Rechaza crear calificación sin autenticación', async () => {
    const res = await fetch(`${API_URL}/grades/mine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: 'Desarrollo Web 1',
        score: 14,
        max_score: 20,
        period: '2026-1',
        comments: 'Intento 1 (Preparación)'
      })
    });
    expect(res.status).toBe(401);
  });

  it('4. Estudiante crea su propia calificación (POST /grades/mine)', async () => {
    const { status, body } = await api('POST', '/grades/mine', {
      subject: 'Desarrollo Web 1',
      score: 14,
      max_score: 20,
      period: '2026-1',
      comments: 'Intento 1 (Preparación)'
    }, studentToken);
    expect(status).toBe(201);
    expect(body.message).toBe('Calificación registrada exitosamente');
    expect(body.grade).toBeDefined();
    expect(body.grade.subject).toBe('Desarrollo Web 1');
    expect(body.grade.score).toBe(14);
    expect(body.grade.max_score).toBe(20);
    expect(body.grade.period).toBe('2026-1');
    expect(body.grade.student).toBeDefined();
    expect(body.grade.student.username).toBe(TEST_USER.username);
    gradeId = body.grade._id;
  });

  it('5. Estudiante agrega examData a su calificación (PUT /grades/mine/:id)', async () => {
    const examData = JSON.stringify({
      questions: [
        { id: 1, type: 'multiple-choice', question: '¿Qué es HTML?', correct: true, score: 1 },
        { id: 2, type: 'multiple-choice', question: '¿Qué es CSS?', correct: false, score: 0 },
        { id: 3, type: 'open', question: 'Explique el modelo de caja', answer: 'Modelo de caja CSS...' }
      ],
      score: 14,
      maxScore: 20,
      attempt: 1,
      attemptType: 'Preparación',
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString()
    });

    const { status, body } = await api('PUT', `/grades/mine/${gradeId}`, { examData }, studentToken);
    expect(status).toBe(200);
    expect(body.message).toBe('Calificación actualizada exitosamente');
    expect(body.grade.examData).toBe(examData);
  });

  it('6. Estudiante recupera sus calificaciones (GET /grades/mine)', async () => {
    const { status, body } = await api('GET', '/grades/mine', null, studentToken);
    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThanOrEqual(1);
    const grade = body.find(g => g._id === gradeId);
    expect(grade).toBeDefined();
    expect(grade.subject).toBe('Desarrollo Web 1');
    expect(grade.score).toBe(14);
    expect(grade.max_score).toBe(20);
    expect(grade.examData).toBeDefined();
    const parsed = JSON.parse(grade.examData);
    expect(parsed.questions).toHaveLength(3);
    expect(parsed.score).toBe(14);
    expect(parsed.attempt).toBe(1);
  });

  it('7. Rechaza que otro estudiante modifique la calificación', async () => {
    const otherUser = {
      username: `otherstudent_${Date.now()}`,
      email: `other_${Date.now()}@test.com`,
      password: 'OtherPass123!',
      full_name: 'Other Student'
    };
    const reg = await api('POST', '/auth/register', otherUser);
    const otherToken = reg.body.token;

    try {
      await api('PUT', `/grades/mine/${gradeId}`, { examData: '{}' }, otherToken);
      expect.fail('Debió rechazar la modificación');
    } catch (e) {
      expect(e.message).toContain('No puedes modificar');
    }
  });

});

describe('Limpieza (admin)', () => {
  let adminToken;

  beforeAll(async () => {
    const { body } = await api('POST', '/auth/login', {
      username: 'admin',
      password: 'Janis724@'
    });
    adminToken = body.token;
  });

  it('Admin elimina la calificación de prueba', async () => {
    const { status, body } = await api('DELETE', `/grades/${gradeId}`, null, adminToken);
    expect(status).toBe(200);
    expect(body.message).toBe('Calificación eliminada exitosamente');
  });

  it('Admin elimina el estudiante de prueba', async () => {
    const { status, body } = await api('DELETE', `/auth/users/${studentId}`, null, adminToken);
    expect(status).toBe(200);
    expect(body.message).toBe('Usuario eliminado exitosamente');
  });
});
