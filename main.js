const CHAR_DELAY_MIN = 0;
const CHAR_DELAY_MAX = 1;
const LINE_DELAY = 0;
const BLOCK_DELAY = 1;
const CHARS_PER_TICK_MIN = 4;
const CHARS_PER_TICK_MAX = 10;

function wait(duration) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCount(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function collectTextNodes(node, textNodes = []) {
  for (const child of node.childNodes) {
    if (child.nodeType === Node.TEXT_NODE && child.textContent) {
      textNodes.push({
        node: child,
        text: child.textContent,
      });
      continue;
    }

    if (child.nodeType === Node.ELEMENT_NODE) {
      collectTextNodes(child, textNodes);
    }
  }

  return textNodes;
}

function prepareTarget(element) {
  const textNodes = collectTextNodes(element);

  for (const textNode of textNodes) {
    textNode.node.textContent = "";
  }

  return {
    element,
    textNodes,
  };
}

async function typeTarget(target, terminalBody) {
  target.element.classList.add("is-ready");

  for (const textNode of target.textNodes) {
    let index = 0;

    while (index < textNode.text.length) {
      const chunkSize = randomCount(CHARS_PER_TICK_MIN, CHARS_PER_TICK_MAX);
      textNode.node.textContent += textNode.text.slice(index, index + chunkSize);
      index += chunkSize;
      terminalBody.scrollTop = terminalBody.scrollHeight;
      await wait(randomDelay(CHAR_DELAY_MIN, CHAR_DELAY_MAX));
    }
  }

  const isSpacerRow = target.element.classList.contains("spacer-row");
  await wait(isSpacerRow ? LINE_DELAY / 2 : LINE_DELAY);
}

async function runTypeSequence() {
  const terminalBody = document.querySelector(".terminal-body");
  const targets = Array.from(document.querySelectorAll(".type-target"));

  if (!terminalBody || targets.length === 0) {
    document.documentElement.classList.remove("js");
    return;
  }

  terminalBody.classList.add("is-typing");

  const preparedTargets = targets.map(prepareTarget);

  await wait(BLOCK_DELAY);

  for (const target of preparedTargets) {
    await typeTarget(target, terminalBody);
  }

  terminalBody.classList.remove("is-typing");
  document.documentElement.classList.remove("js");
}

window.addEventListener("DOMContentLoaded", () => {
  runTypeSequence().catch(() => {
    for (const target of document.querySelectorAll(".type-target")) {
      target.classList.add("is-ready");
    }

    const terminalBody = document.querySelector(".terminal-body");

    if (terminalBody) {
      terminalBody.classList.remove("is-typing");
    }

    document.documentElement.classList.remove("js");
  });
});