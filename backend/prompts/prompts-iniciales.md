METAPROMPT

# Instructions You are an expert in prompt engineering. Given the following prompt, prepare it using best-practice structure (role, objective, etc.) and formatting to achieve a precise and comprehensive result. Stick strictly to the requested objective by carefully analyzing what is asked in the original prompt. Include this two points in the prompt: **Analyze the project and ask me any questions you consider necessary to clarify before proposing the solution.** Keep consistency with existing schema. # Original Prompt: [ crea una suite de tests unitarios en Jest para la funcionalidad de insertar candidatos en base de datos. hay 2 familias principales de tests, recepción de los datos del formulario, y guardado en la base de datos. Aplica las buenas prácticas aprendidas en este módulo (tienes algo de información en los diferentes chats del proyecto) y si consideraS necesario aplicar otra hazo y explica porque. Muchas gracias. ]


PROMPT 

# Role

Actúa como un desarrollador senior especializado en TypeScript, Node.js, Jest, testing unitario, TDD y buenas prácticas de arquitectura backend.

# Objective

Analiza el proyecto y crea una suite de tests unitarios en Jest para la funcionalidad de inserción de candidatos en base de datos, manteniendo coherencia con la estructura, estilo, convenciones y esquema existente del proyecto.

# Context

El proyecto corresponde a un ATS/LTI donde ya existe una funcionalidad básica para insertar nuevos candidatos. Esta funcionalidad recibe datos desde un formulario web, aunque en el futuro también podrá recibir datos vía API desde múltiples fuentes, como candidaturas directas o sistemas automatizados de parsing.

El objetivo del ejercicio es aplicar TDD y buenas prácticas de testing para garantizar que la funcionalidad de inserción de candidatos se comporta correctamente.

# Mandatory initial step

Analyze the project and ask me any questions you consider necessary to clarify before proposing the solution.

Antes de escribir código, revisa la estructura del proyecto, identifica los archivos relevantes, las funciones/controladores/servicios implicados en la inserción de candidatos y valida cómo se está usando actualmente Jest, TypeScript, Prisma o cualquier otra capa de persistencia.

Si falta información, si hay varias interpretaciones posibles, o si necesitas confirmar nombres de campos, rutas, modelos, servicios o dependencias, pregúntame primero.

# Scope of the tests

Crea tests unitarios para dos familias principales:

## 1. Recepción de datos del formulario

Incluye tests que validen, como mínimo:

* Que los datos enviados desde el formulario se reciben correctamente.
* Que los campos esperados del candidato se procesan respetando el schema existente.
* Que se mantiene la consistencia con los nombres de propiedades, tipos y estructura ya definidos en el proyecto.
* Que se contempla al menos un caso válido de inserción de candidato.
* Que se contempla al menos un caso inválido si el código actual lo permite o si ya existe validación.

## 2. Guardado en base de datos

Incluye tests que validen, como mínimo:

* Que la funcionalidad llama correctamente a la capa de persistencia para guardar el candidato.
* Que los datos enviados a la base de datos tienen el formato esperado.
* Que se mockea la base de datos cuando sea necesario para evitar modificar datos reales.
* Que se comprueba el resultado esperado cuando el guardado es correcto.
* Que se contempla el comportamiento ante error de base de datos si la implementación actual permite probarlo de forma razonable.

# Technical requirements

* Usa Jest.
* Usa TypeScript.
* Mantén consistencia con la configuración existente del proyecto.
* Crea o completa el archivo de tests en:

```text
backend/src/tests/tests-iniciales.test.ts
```

* No modifiques código de producción salvo que sea estrictamente necesario para hacer la funcionalidad testeable.
* Si propones modificar código de producción, explica claramente:

  * Qué archivo se modificaría.
  * Por qué es necesario.
  * Qué beneficio aporta al testing o a la calidad del diseño.
* Evita tests frágiles o excesivamente acoplados a detalles internos innecesarios.
* Aplica el patrón Arrange-Act-Assert.
* Usa nombres de test claros y descriptivos.
* Agrupa los tests con `describe`.
* Usa mocks para dependencias externas, especialmente base de datos o Prisma si aparece en el proyecto.
* Mantén los tests independientes entre sí.
* Limpia mocks entre tests con `beforeEach`, `afterEach` o la estrategia más adecuada.
* No alteres datos reales de la base de datos.
* Si el proyecto usa Prisma, sigue una estrategia de mocking adecuada para Prisma Client.

# Best practices to apply

Aplica las buenas prácticas aprendidas en el módulo:

* TDD cuando sea posible.
* Tests unitarios enfocados en una responsabilidad concreta.
* Patrón AAA: Arrange, Act, Assert.
* Mocks para aislar dependencias externas.
* Tests legibles, mantenibles y con intención clara.
* Casos positivos y negativos cuando tengan sentido.
* Consistencia con el schema existente.
* No inventes campos ni estructuras que no existan en el proyecto.

Si consideras necesario aplicar alguna buena práctica adicional, hazlo, pero explica brevemente por qué la aplicas.

# Expected output

Primero, realiza el análisis del proyecto y dime:

1. Qué archivos has identificado como relevantes.
2. Qué función, servicio, controlador o endpoint parece encargarse de insertar candidatos.
3. Qué schema/modelo de candidato existe.
4. Qué dudas necesitas resolver antes de proponer la solución, si las hay.

Después, cuando las dudas estén resueltas, proporciona:

1. El contenido completo propuesto para:

```text
backend/src/tests/tests-iniciales.test.ts
```

2. Una explicación breve de:

   * Qué cubre cada familia de tests.
   * Qué se está mockeando y por qué.
   * Cómo ejecutar los tests.
   * Qué comando usar, por ejemplo:

```bash
npm test
```

3. El contenido sugerido para documentar el prompt utilizado en:

```text
prompts/prompts-iniciales.md
```

# Constraints

* No inventes rutas, nombres de archivos, funciones, modelos ni campos si no aparecen en el proyecto.
* Si algo no está claro, pregunta antes de generar la solución final.
* No propongas tests de integración si el ejercicio pide tests unitarios, salvo que expliques claramente la diferencia y lo dejes fuera del entregable principal.
* No uses una base de datos real durante los tests.
* Mantén el código simple, claro y adaptado al nivel del ejercicio.
* El resultado debe ser compatible con Jest y TypeScript.
* Keep consistency with existing schema.
