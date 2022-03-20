describe("SKATE PARK", () => {
  it("Smoke testing on login page", () => {
    cy.visit("http://localhost:3000/login");
    cy.contains("Iniciar Sesión");
  });

  it("Testing email input", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("input:first").type("test@test.com");
  });

  it("Testing registrate button ", () => {
    cy.visit("http://localhost:3000/login");
    cy.contains("Regístrate").click();
  });
});
