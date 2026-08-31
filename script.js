// =====================================================
// CONFIGURAÇÃO
// =====================================================

let captcha = null;
let currentCode = null;


// =====================================================
// ELEMENTOS
// =====================================================

const captchaSection =
  document.getElementById(
    "captchaSection"
  );

const captchaQuestion =
  document.getElementById(
    "captchaQuestion"
  );

const captchaInput =
  document.getElementById(
    "captchaInput"
  );

const captchaButton =
  document.getElementById(
    "captchaButton"
  );

const captchaError =
  document.getElementById(
    "captchaError"
  );

const codeSection =
  document.getElementById(
    "codeSection"
  );

const codeForm =
  document.getElementById(
    "codeForm"
  );

const codeInput =
  document.getElementById(
    "code"
  );

const validateButton =
  document.getElementById(
    "validateButton"
  );

const codeMessage =
  document.getElementById(
    "codeMessage"
  );

const downloadSection =
  document.getElementById(
    "downloadSection"
  );

const downloadButton =
  document.getElementById(
    "downloadButton"
  );

const resetButton =
  document.getElementById(
    "resetButton"
  );


// =====================================================
// CAPTCHA
// =====================================================

function generateCaptcha() {

  const first =
    Math.floor(
      Math.random() * 8
    ) + 2;

  const second =
    Math.floor(
      Math.random() * 8
    ) + 1;

  captcha = {
    first,
    second,
    answer: first + second
  };

  captchaQuestion.innerHTML =
    `Quanto é <strong>${first}</strong> + <strong>${second}</strong>?`;

  captchaInput.value = "";

  captchaError.textContent = "";
}


// =====================================================
// INICIA CAPTCHA
// =====================================================

generateCaptcha();


// =====================================================
// VALIDA CAPTCHA
// =====================================================

captchaButton.addEventListener(
  "click",
  function () {

    const answer =
      Number(
        captchaInput.value
      );

    if (
      answer !== captcha.answer
    ) {

      captchaError.textContent =
        "Resposta incorreta. Tente novamente.";

      generateCaptcha();

      return;
    }

    // CAPTCHA aprovado

    captchaSection.classList.add(
      "hidden"
    );

    codeSection.classList.remove(
      "hidden"
    );

    codeInput.focus();
  }
);


// =====================================================
// VALIDA CÓDIGO
// =====================================================

codeForm.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();

    codeMessage.className =
      "message";

    codeMessage.textContent = "";

    validateButton.disabled = true;

    validateButton.textContent =
      "Verificando...";

    const normalizedCode =
      codeInput.value
        .trim()
        .toUpperCase();

    try {

      // Busca o JSON de códigos

      const response =
        await fetch(
          "data/codes.json",
          {
            cache: "no-store"
          }
        );

      if (!response.ok) {
        throw new Error(
          "Não foi possível carregar os códigos."
        );
      }

      const data =
        await response.json();

      // Verifica o código

      const valid =
        Array.isArray(data.codes) &&
        data.codes.includes(
          normalizedCode
        );

      if (!valid) {

        codeMessage.className =
          "message error";

        codeMessage.textContent =
          "Código inválido.";

        return;
      }


      // =========================================
      // VERIFICA SE O PDF EXISTE
      // =========================================

      const documentPath =
        `documents/${encodeURIComponent(
          normalizedCode
        )}.pdf`;

      const documentResponse =
        await fetch(
          documentPath,
          {
            method: "HEAD"
          }
        );

      if (
        !documentResponse.ok
      ) {

        codeMessage.className =
          "message error";

        codeMessage.textContent =
          "O código é válido, mas o documento não está disponível.";

        return;
      }


      // =========================================
      // CÓDIGO VÁLIDO
      // =========================================

      currentCode =
        normalizedCode;

      codeMessage.className =
        "message success";

      codeMessage.innerHTML =
        "✓ Código válido.";

      // Define o PDF

      downloadButton.href =
        documentPath;

      // Mostra download

      downloadSection.classList.remove(
        "hidden"
      );

      // Esconde formulário

      codeSection.classList.add(
        "hidden"
      );

    } catch (error) {

      console.error(error);

      codeMessage.className =
        "message error";

      codeMessage.textContent =
        "Não foi possível validar o código. Tente novamente.";

    } finally {

      validateButton.disabled =
        false;

      validateButton.textContent =
        "Validar código";
    }
  }
);


// =====================================================
// RESET
// =====================================================

resetButton.addEventListener(
  "click",
  function () {

    currentCode = null;

    codeInput.value = "";

    codeMessage.textContent = "";

    codeMessage.className =
      "message";

    downloadSection.classList.add(
      "hidden"
    );

    codeSection.classList.remove(
      "hidden"
    );

    generateCaptcha();

  }
);