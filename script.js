/*
=========================================================
PROJECT: Productivity Calculator
AUTHOR: Leo Florentín
GITHUB: lflorentin0509
YEAR: 2026

Application logic developed by Leo Florentín.
=========================================================
*/
// =========================================
// ELEMENTOS
// =========================================

const welcomeScreen =
    document.getElementById("welcomeScreen");

const calculatorScreen =
    document.getElementById("calculatorScreen");

const nameInput =
    document.getElementById("nameInput");

const startButton =
    document.getElementById("startButton");

const changeUserButton =
    document.getElementById("changeUserButton");

const helloUser =
    document.getElementById("helloUser");

const nameError =
    document.getElementById("nameError");

const processSelect =
    document.getElementById("processSelect");

const netInput =
    document.getElementById("netInput");

const targetDisplay =
    document.getElementById("targetDisplay");

const calculateButton =
    document.getElementById("calculateButton");

const calculatorError =
    document.getElementById("calculatorError");

const resultCard =
    document.getElementById("resultCard");

const performanceNumber =
    document.getElementById("performanceNumber");

const resultStatus =
    document.getElementById("resultStatus");

const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");

const resultProcess =
    document.getElementById("resultProcess");

const resultNet =
    document.getElementById("resultNet");

const resultTarget =
    document.getElementById("resultTarget");

const resetButton =
    document.getElementById("resetButton");


// =========================================
// ELEMENTOS DEL MEDIDOR
// =========================================

const gaugeProgress =
    document.getElementById("gaugeProgress");

const gaugeDifference =
    document.getElementById("gaugeDifference");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");


// =========================================
// NUEVOS ELEMENTOS
// =========================================

const currentDate =
    document.getElementById("currentDate");

const shareButton =
    document.getElementById("shareButton");

const shareButtonText =
    document.getElementById("shareButtonText");


// =========================================
// DATOS ACTUALES
// =========================================

let userName = "";

let lastPerformance = null;
let lastProcess = "";


// =========================================
// INICIAR APLICACIÓN
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


function initializeApp() {

    showCurrentDate();

    const savedName =
        localStorage.getItem(
            "performanceUserName"
        );


    // Si ya usó la calculadora antes,
    // no volvemos a pedir el nombre.

    if (savedName) {

        userName = savedName;

        nameInput.value =
            savedName;

        helloUser.textContent =
            `Hola, ${savedName} 👋`;

        welcomeScreen.classList.remove(
            "active"
        );

        calculatorScreen.classList.add(
            "active"
        );

    }

    else {

        setTimeout(
            function () {

                nameInput.focus();

            },
            150
        );

    }

}


// =========================================
// FECHA DE LA JORNADA
// =========================================

function showCurrentDate() {

    const today =
        new Date();


    const formattedDate =
        today.toLocaleDateString(
            "es-AR",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    currentDate.textContent =
        formattedDate
            .charAt(0)
            .toUpperCase() +
        formattedDate.slice(1);

}


// =========================================
// COMENZAR
// =========================================

startButton.addEventListener(
    "click",
    startApp
);


nameInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            startApp();

        }

    }
);


function startApp() {

    const name =
        nameInput.value.trim();


    if (name === "") {

        nameError.classList.add(
            "show"
        );

        nameInput.focus();

        return;

    }


    nameError.classList.remove(
        "show"
    );


    userName = name;


    // Guardamos solamente el nombre.
    // No guardamos productividad.

    localStorage.setItem(
        "performanceUserName",
        userName
    );


    helloUser.textContent =
        `Hola, ${userName} 👋`;


    welcomeScreen.classList.remove(
        "active"
    );

    calculatorScreen.classList.add(
        "active"
    );


    setTimeout(
        function () {

            processSelect.focus();

        },
        150
    );

}


// =========================================
// CAMBIAR USUARIO
// =========================================

changeUserButton.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "performanceUserName"
        );


        userName = "";

        nameInput.value = "";


        resetCalculator(false);


        calculatorScreen.classList.remove(
            "active"
        );

        welcomeScreen.classList.add(
            "active"
        );


        setTimeout(
            function () {

                nameInput.focus();

            },
            150
        );

    }
);


// =========================================
// MOSTRAR TARGET AUTOMÁTICAMENTE
// =========================================

processSelect.addEventListener(
    "change",
    function () {

        const target =
            Number(
                processSelect.value
            );


        if (target) {

            targetDisplay.textContent =
                target;

        }

        else {

            targetDisplay.textContent =
                "—";

        }

    }
);


// =========================================
// CALCULAR CON ENTER
// =========================================

netInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            calculatePerformance();

        }

    }
);


// =========================================
// BOTÓN CALCULAR
// =========================================

calculateButton.addEventListener(
    "click",
    calculatePerformance
);


// =========================================
// NORMALIZAR NETA
// =========================================

function getNetValue() {

    /*
        Permitimos:

        314,2
        314.2
        314

        También eliminamos espacios.
    */

    const rawValue =
        netInput.value
            .trim()
            .replace(/\s/g, "")
            .replace(",", ".");


    if (rawValue === "") {

        return NaN;

    }


    return Number(rawValue);

}


// =========================================
// CALCULAR PERFORMANCE
// =========================================

function calculatePerformance() {

    const target =
        Number(
            processSelect.value
        );


    const net =
        getNetValue();


    // =====================================
    // VALIDACIÓN
    // =====================================

    if (
        !target ||
        !Number.isFinite(net) ||
        net < 0
    ) {

        calculatorError.classList.add(
            "show"
        );

        resultCard.classList.add(
            "hidden"
        );

        return;

    }


    calculatorError.classList.remove(
        "show"
    );


    // =====================================
    // FÓRMULA DE PERFORMANCE
    // =====================================

    /*
        Performance:

        (Neta / Target - 1) × 100

        Ejemplo:

        Neta = 314,2
        Target = 230

        314,2 / 230 = 1,366

        Performance = +36,6%
    */

    const performance =
        ((net / target) - 1) * 100;


    const roundedPerformance =
        Math.round(
            performance * 10
        ) / 10;


    // =====================================
    // CUMPLIMIENTO DEL TARGET
    // =====================================

    /*
        Ejemplo:

        Neta = 314,2
        Target = 230

        Cumplimiento = 136,6%
        Performance = +36,6%
    */

    const targetAchievement =
        (net / target) * 100;


    // =====================================
    // INFORMACIÓN DEL PROCESO
    // =====================================

    const processName =
        processSelect.options[
            processSelect.selectedIndex
        ].text;


    resultProcess.textContent =
        processName;


    resultNet.textContent =
        net.toLocaleString(
            "es-AR",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 1
            }
        );


    resultTarget.textContent =
        target;


    // Datos temporales para compartir.

    lastPerformance =
        roundedPerformance;

    lastProcess =
        processName;


    // =====================================
    // LIMPIAR ESTADOS ANTERIORES
    // =====================================

    resultCard.classList.remove(
        "incredible",
        "excellent",
        "target",
        "close",
        "difficult"
    );


    // =====================================
    // MENSAJES SEGÚN PERFORMANCE
    // =====================================


    // -------------------------------------
    // +50% O MÁS
    // -------------------------------------

    if (roundedPerformance >= 50) {

        resultCard.classList.add(
            "incredible"
        );

        resultStatus.textContent =
            "INCREÍBLE";

        resultTitle.textContent =
            `¡${userName}, la rompiste toda hoy!`;

        resultMessage.textContent =
            "Tuviste una jornada increíble. " +
            "Seguí así por este camino.";

    }


    // -------------------------------------
    // ENTRE +0.1% Y +49.9%
    // -------------------------------------

    else if (roundedPerformance > 0) {

        resultCard.classList.add(
            "excellent"
        );

        resultStatus.textContent =
            "EXCELENTE";

        resultTitle.textContent =
            `¡Felicitaciones, ${userName}!`;

        resultMessage.textContent =
            "Hoy tuviste un excelente día. " +
            "Terminaste por encima del target " +
            "de tu proceso.";

    }


    // -------------------------------------
    // EXACTAMENTE 0%
    // -------------------------------------

    else if (roundedPerformance === 0) {

        resultCard.classList.add(
            "target"
        );

        resultStatus.textContent =
            "TARGET CUMPLIDO";

        resultTitle.textContent =
            `¡${userName}, target cumplido!`;

        resultMessage.textContent =
            "Terminaste justo en el objetivo " +
            "del proceso. ¡Buen trabajo!";

    }


    // -------------------------------------
    // ENTRE -0.1% Y -20%
    // -------------------------------------

    else if (roundedPerformance >= -20) {

        resultCard.classList.add(
            "close"
        );

        resultStatus.textContent =
            "CASI";

        resultTitle.textContent =
            `Casi, ${userName}.`;

        resultMessage.textContent =
            "Fue un día difícil, pero no es " +
            "el último. ¡Mañana vamos de nuevo!";

    }


    // -------------------------------------
    // MENOR A -20%
    // -------------------------------------

    else {

        resultCard.classList.add(
            "difficult"
        );

        resultStatus.textContent =
            "DÍA COMPLICADO";

        resultTitle.textContent =
            `${userName}, hoy fue un día complicado.`;

        resultMessage.textContent =
            "Pero fuerzas. Mañana será otro " +
            "día y una nueva oportunidad.";

    }


    // =====================================
    // TEXTO DEL MEDIDOR
    // =====================================

    if (roundedPerformance > 0) {

        gaugeDifference.textContent =
            "POR ENCIMA DEL TARGET";

    }

    else if (roundedPerformance < 0) {

        gaugeDifference.textContent =
            "POR DEBAJO DEL TARGET";

    }

    else {

        gaugeDifference.textContent =
            "TARGET EXACTO";

    }


    // =====================================
    // MOSTRAR RESULTADO
    // =====================================

    resultCard.classList.remove(
        "hidden"
    );


    // =====================================
    // ANIMACIONES
    // =====================================

    animatePerformance(
        roundedPerformance
    );

    animateGauge(
        roundedPerformance
    );

    animateProgressBar(
        targetAchievement
    );


    // =====================================
    // BAJAR AL RESULTADO
    // =====================================

    setTimeout(
        function () {

            resultCard.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        },
        150
    );

}


// =========================================
// ANIMACIÓN DEL CÍRCULO
// =========================================

function animateGauge(
    performanceValue
) {

    /*
        Circunferencia aproximada:

        2 × PI × 92 ≈ 578
    */

    const circumference = 578;


    /*
        El círculo muestra la magnitud
        de la diferencia contra target.

        Máximo visual = 100%.
    */

    const gaugeValue =
        Math.min(
            Math.abs(
                performanceValue
            ),
            100
        );


    const gaugeOffset =
        circumference -
        (
            gaugeValue /
            100
        ) *
        circumference;


    // Reiniciar

    gaugeProgress.style.transition =
        "none";

    gaugeProgress.style.strokeDashoffset =
        circumference;


    // Forzar actualización del navegador

    gaugeProgress.getBoundingClientRect();


    // Animar

    gaugeProgress.style.transition =
        "stroke-dashoffset 1.4s cubic-bezier(.22, 1, .36, 1), stroke 0.4s";


    gaugeProgress.style.strokeDashoffset =
        gaugeOffset;

}


// =========================================
// BARRA DE CUMPLIMIENTO
// =========================================

function animateProgressBar(
    targetAchievement
) {

    /*
        Escala:

        0% -------- 100% ---- 150%

        El target está visualmente
        ubicado en 66,66%.
    */

    const safeAchievement =
        Math.max(
            0,
            targetAchievement
        );


    const barWidth =
        Math.min(
            (
                safeAchievement /
                150
            ) * 100,
            100
        );


    // Reiniciar

    progressBar.style.transition =
        "none";

    progressBar.style.width =
        "0%";


    // Forzar actualización

    progressBar.getBoundingClientRect();


    // Animar

    progressBar.style.transition =
        "width 1.2s cubic-bezier(.22, 1, .36, 1)";


    progressBar.style.width =
        `${barWidth}%`;


    // Texto

    progressText.textContent =
        `${safeAchievement.toLocaleString(
            "es-AR",
            {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            }
        )}% del target`;

}


// =========================================
// ANIMACIÓN DEL PORCENTAJE
// =========================================

function animatePerformance(
    finalValue
) {

    const duration = 1000;

    const startTime =
        performance.now();


    function update(
        currentTime
    ) {

        const elapsed =
            currentTime -
            startTime;


        const progress =
            Math.min(
                elapsed /
                duration,
                1
            );


        // Animación suave

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const currentValue =
            finalValue *
            eased;


        const rounded =
            Math.round(
                currentValue * 10
            ) / 10;


        performanceNumber.textContent =
            formatPerformance(
                rounded
            );


        if (progress < 1) {

            requestAnimationFrame(
                update
            );

        }

        else {

            performanceNumber.textContent =
                formatPerformance(
                    finalValue
                );

        }

    }


    requestAnimationFrame(
        update
    );

}


// =========================================
// FORMATEAR PERFORMANCE
// =========================================

function formatPerformance(
    value
) {

    const formatted =
        Math.abs(value)
            .toLocaleString(
                "es-AR",
                {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                }
            );


    if (value > 0) {

        return `+${formatted}%`;

    }


    if (value < 0) {

        return `-${formatted}%`;

    }


    return "0,0%";

}


// =========================================
// COMPARTIR RESULTADO
// =========================================

shareButton.addEventListener(
    "click",
    shareResult
);


async function shareResult() {

    if (lastPerformance === null) {

        return;

    }


    const performanceText =
        formatPerformance(
            lastPerformance
        );


    const date =
        new Date()
            .toLocaleDateString(
                "es-AR"
            );


    /*
        No incluimos Neta Sistémica
        ni Target en el mensaje compartido.

        Solo mostramos el resultado final.
    */

    const shareText =
`📊 Mi jornada

👤 ${userName}
📅 ${date}

⚙️ Proceso: ${lastProcess}
📈 Performance: ${performanceText}

Performance Calculator`;


    // =====================================
    // COMPARTIR NATIVO
    // =====================================

    if (navigator.share) {

        try {

            await navigator.share({
                title:
                    "Mi performance de hoy",

                text:
                    shareText
            });

        }

        catch (error) {

            /*
                AbortError normalmente significa
                que la persona simplemente cerró
                el menú de compartir.
            */

            if (
                error.name !==
                "AbortError"
            ) {

                console.error(
                    "No se pudo compartir:",
                    error
                );

            }

        }

    }


    // =====================================
    // PC / NAVEGADOR SIN SHARE
    // =====================================

    else {

        await copyResult(
            shareText
        );

    }

}


// =========================================
// COPIAR RESULTADO
// =========================================

async function copyResult(
    text
) {

    try {

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            await navigator.clipboard.writeText(
                text
            );

        }

        else {

            fallbackCopy(
                text
            );

        }


        showCopiedMessage();

    }

    catch (error) {

        fallbackCopy(
            text
        );

        showCopiedMessage();

    }

}


// =========================================
// FALLBACK COPIAR
// =========================================

function fallbackCopy(
    text
) {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;

    textarea.setAttribute(
        "readonly",
        ""
    );


    textarea.style.position =
        "fixed";

    textarea.style.left =
        "-9999px";

    textarea.style.opacity =
        "0";


    document.body.appendChild(
        textarea
    );


    textarea.select();

    textarea.setSelectionRange(
        0,
        textarea.value.length
    );


    document.execCommand(
        "copy"
    );


    textarea.remove();

}


// =========================================
// MENSAJE RESULTADO COPIADO
// =========================================

function showCopiedMessage() {

    shareButtonText.textContent =
        "Resultado copiado ✓";


    setTimeout(
        function () {

            shareButtonText.textContent =
                "Compartir resultado";

        },
        2000
    );

}


// =========================================
// CALCULAR OTRA JORNADA
// =========================================

resetButton.addEventListener(
    "click",
    function () {

        resetCalculator(true);

    }
);


function resetCalculator(
    scrollToTop = true
) {

    // Limpiar inputs

    processSelect.value = "";

    netInput.value = "";


    // Limpiar target

    targetDisplay.textContent =
        "—";


    // Ocultar resultado

    resultCard.classList.add(
        "hidden"
    );


    // Limpiar estados

    resultCard.classList.remove(
        "incredible",
        "excellent",
        "target",
        "close",
        "difficult"
    );


    // Limpiar errores

    calculatorError.classList.remove(
        "show"
    );


    // Reiniciar número

    performanceNumber.textContent =
        "0,0%";


    // Reiniciar textos

    gaugeDifference.textContent =
        "VS TARGET";

    progressText.textContent =
        "0%";


    // Reiniciar círculo

    gaugeProgress.style.transition =
        "none";

    gaugeProgress.style.strokeDashoffset =
        "578";


    // Reiniciar barra

    progressBar.style.transition =
        "none";

    progressBar.style.width =
        "0%";


    // Limpiar resultado compartible

    lastPerformance = null;
    lastProcess = "";


    if (scrollToTop) {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        setTimeout(
            function () {

                processSelect.focus();

            },
            400
        );

    }

}