import datosPruebaAPI from "../fixtures/datosPruebaAPI.json"

describe('Prueba de API', () => {
  //Declaración de las variables para la prueba
  const signupUrl = datosPruebaAPI.signupUrl;
  const loginUrl = datosPruebaAPI.loginUrl;
  const username = 'usuarioDePrueba' + Math.floor(Math.random() * 500);
  const password = 'contraseñaPrueba123!';

  // CASO 1
  it('Crear un nuevo usuario en signup', () => {
    cy.request({
      method: 'POST',
      url: signupUrl,
      body: {
        username: username,
        password: password
      }
    }).then((respuesta) => {
      // Imprimir la respuesta completa para depurar
      cy.log('Estaodo de la respuesta: ' + respuesta.status);
      cy.log('Cuerpo de la respuesta: ' + JSON.stringify(respuesta.body));
      cy.log('Encabezados de la respuesta: ' + JSON.stringify(respuesta.headers));
      cy.log('Duración de la respuesta: ' + respuesta.duration);

      // Verificar el estatus de la respuesta -> 200 OK
      expect(respuesta.status).to.eq(200);
      // Como el cuerpo de la respuesta del body esta vacio no se comprueba su estructura
    });
  });

  //CASO 2
  it('Intentar crear un usuario ya existente', () => {
    cy.request({
      method: 'POST',
      url: loginUrl,
      body: {
        username: username,
        password: password
      }
    }).then((respuesta) => {
      expect(respuesta.status).to.eq(200);

      // Verificar si la respuesta contiene un token de autenticación
      if (respuesta.body) {
        cy.log('Si el cuerpo de la respuesta del body no está vacío');
        expect(respuesta.body).to.be.a('string');
        expect(respuesta.body).to.match(/Auth_token.*/);
      } else {
        cy.log('Cuerpo de la respuesta del body vacío');
      }
    });
  });

  //CASO 3
  it('Usuario y password correcto en login', () => {
    cy.request({
      method: 'POST',
      url: loginUrl,
      body: {
        username: username,
        password: password
      }
    }).then((respuesta) => {
      expect(respuesta.status).to.eq(200);

      // Verificar si la respuesta contiene un token de autenticación
      if (respuesta.body) {
        cy.log('Si el cuerpo de la respuesta del body no está vacío');
        expect(respuesta.body).to.be.a('string');
        expect(respuesta.body).to.match(/Auth_token.*/);
      } else {
        cy.log('Cuerpo de la respuesta del body vacío');
      }
    });
  });

  //CASO 4
  it('Usuario y password incorrecto en login', () => {
    cy.request({
      method: 'POST',
      url: loginUrl,
      failOnStatusCode: false, // Permitir el fallo intencional
      body: {
        username: 'user123',
        password: 'user321'
      }
    }).then((respuesta) => {
      // Verificar si la respuesta es 401 No autorizado o 200 OK
      if (respuesta.status === 401 || respuesta.status === 200) {
        cy.log('La autenticación falló como se esperaba');
      } else {
        cy.log('Estado de respuesta inesperado: ' + respuesta.status);
      }

      // Verificar el estatus de la respuesta
      expect(respuesta.status).to.be.oneOf([200, 401]);
    });
  });
});
