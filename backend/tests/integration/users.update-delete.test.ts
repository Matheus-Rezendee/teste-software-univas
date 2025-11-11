import request from "supertest";
import { app } from "../../src/index";
import { prisma } from "../../src/prisma";

describe("Testes de Atualização e Exclusão de Usuários", () => {
  let userId: string;

  beforeAll(async () => {
    // limpa base e cria um usuário para os testes
    await prisma.user.deleteMany();
    const user = await prisma.user.create({
      data: {
        name: "Usuário Teste",
        email: "teste@exemplo.com",
        password: "123456",
      },
    });
    userId = user.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("deve atualizar um usuário existente", async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send({
        name: "Usuário Atualizado",
        email: "atualizado@exemplo.com",
      })
      .expect(200);

    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Usuário Atualizado");
    expect(response.body.email).toBe("atualizado@exemplo.com");
  });

  it("deve retornar erro ao tentar atualizar um usuário inexistente", async () => {
    const response = await request(app)
      .put(`/api/users/usuario-inexistente`)
      .send({
        name: "Teste Inexistente",
      })
      .expect(404);

    expect(response.body).toHaveProperty("error");
  });

  it("deve excluir um usuário existente", async () => {
    const response = await request(app)
      .delete(`/api/users/${userId}`)
      .expect(200);

    expect(response.body.message).toBe("Usuário deletado com sucesso");

    const userInDb = await prisma.user.findUnique({
      where: { id: userId },
    });
    expect(userInDb).toBeNull();
  });

  it("deve retornar erro ao tentar excluir um usuário inexistente", async () => {
    const response = await request(app)
      .delete(`/api/users/usuario-inexistente`)
      .expect(404);

    expect(response.body).toHaveProperty("error");
  });
});
