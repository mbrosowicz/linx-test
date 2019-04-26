// I chose to create a shortcut method to select elements from the DOM.
// Eu escolhi criar um método de atalho para selecionar elementos do DOM.
const $ = elem => {
  return document.querySelector(elem);
};

// I chose to use CSS Variables to calculate the transform property with dynamic translate value and control the slider.
// Eu escolhi usar Variáveis CSS para calcular a propriedade transform com valor translate dinâmico e controlar o slider.
// This was the quickest and most clever way that I tought of developing the slider functionality.
// Esta foi a maneira mais rápida e inteligente que eu pensei de desenvolver a funcionalidade do slider.
const moveSlider = (element, value) => {
  element.style.setProperty("--i", value);
};

// I created this method to fix the money part of the installments string, which was not properly formatted.
// Eu criei este método para corrigir a parte de dinheiro da string de parcelas, que não estava formatada corretamente.
const fixInstallmentValue = installmentsString => {
  const blankIndex = installmentsString.lastIndexOf(" ");
  const tagIndex = installmentsString.lastIndexOf("<");

  const moneyString = installmentsString.substring(blankIndex, tagIndex);
  const dotIndex = moneyString.indexOf(".");
  const formattedMoney = `R$ ${moneyString.substring(
    0,
    dotIndex
  )},${moneyString.substring(dotIndex + 1, moneyString.length)}`;

  return `${installmentsString.substr(
    0,
    blankIndex
  )}${formattedMoney}${installmentsString.substr(
    tagIndex,
    installmentsString.length
  )}`;
};

// This method generates the children nodes of the slider, the slides.
// Este método gera os nós filhos do slider, os slides.
const generateReccomended = reccomendedItems => {
  const slides = $("#slidesContainer");
  reccomendedItems.forEach(reccomendedItem => {
    const newSlide = document.createElement("div");
    newSlide.classList.add("slide");
    const slideDetailLink = document.createElement("a");
    const slideImg = document.createElement("img");
    const slideDesc = document.createElement("p");
    const slidePrice = document.createElement("span");
    const slideInstallments = document.createElement("span");
    const slideExtraAmount = document.createElement("span");
    slideDetailLink.append(slideImg, slideDesc);
    const nodes = [slideDetailLink];
    if (reccomendedItem.oldPrice) {
      const slideOldPrice = document.createElement("span");
      const oldPriceNode = document.createTextNode(
        `De: ${reccomendedItem.oldPrice}`
      );
      slideOldPrice.classList.add("block-display");
      slideOldPrice.append(oldPriceNode);
      nodes.push(slideOldPrice);
    }
    nodes.push(slidePrice, slideInstallments, slideExtraAmount);

    slideDetailLink.id = `reccomendedItemDetailUrl`;
    slideDetailLink.target = "_blank";
    slideDetailLink.classList.add("detail-link");
    slideDetailLink.href = reccomendedItem.detailUrl;

    slideImg.id = `reccomendedItemImage${reccomendedItem.businessId}`;
    slideImg.src = reccomendedItem.imageName;
    slideImg.classList.add("item-image");

    const priceNode = document.createTextNode(`Por: ${reccomendedItem.price}`);
    slidePrice.append(priceNode);
    slidePrice.classList.add(
      "red-font",
      "block-display",
      "big-font",
      "bold-font"
    );

    const descNode = document.createTextNode(reccomendedItem.name);
    slideDesc.append(descNode);
    slideDesc.classList.add("item-description", "block-display");

    slideInstallments.innerHTML = fixInstallmentValue(
      reccomendedItem.productInfo.paymentConditions
    );
    slideInstallments.classList.add("red-font", "block-display", "bold-font");

    const extraAmountNode = document.createTextNode("sem juros");
    slideExtraAmount.append(extraAmountNode);
    slideExtraAmount.classList.add("red-font", "block-display");

    newSlide.append(...nodes);
    slides.append(newSlide);
  });
};

// This method generates the node that contains the visited item information.
// Este método gera o nó que contém as informações do item visitado.
const generateVisited = visitedItem => {
  const visitedItemPriceNode = document.createTextNode(
    `Por: ${visitedItem.price}`
  );
  const visitedItemOldPriceNode = document.createTextNode(
    `De: ${visitedItem.oldPrice}`
  );
  const visitedItemDescNode = document.createTextNode(visitedItem.name);
  $("#visitedItemDetailUrl").href = visitedItem.detailUrl;
  $("#visitedItemImage").src = visitedItem.imageName;
  $("#visitedItemDescription").append(visitedItemDescNode);
  $("#visitedItemOldPrice").append(visitedItemOldPriceNode);
  $("#visitedItemNewPrice").append(visitedItemPriceNode);
  $("#visitedItemInstallments").innerHTML = fixInstallmentValue(
    visitedItem.productInfo.paymentConditions
  );
};

// This method is called on the loading of the page, it calls the "building" methods and sets the slide control events (that call a function to increment or decrement the index and the moveSlider) to be listenend by the arrows.
// Este método é chamado no carregamento da página, ele chama os métodos de "construção" e define os eventos de controle do slider (que chamam uma função para incrementar ou diminuir o índice e o moveSlider) para serem ouvidos pelas setas.
// Again, this was the quickest and most clever way that I tought of developing the slider functionality.
// Novamente, esta foi a maneira mais rápida e inteligente que eu pensei de desenvolver a funcionalidade do slider.
const loadItems = itemsJson => {
  generateVisited(itemsJson.data.reference.item);
  generateReccomended(itemsJson.data.recommendation);

  const slider = $(".recommended-items-content>div.slides");
  const toggleRight = $("#toggleRight");
  const toggleLeft = $("#toggleLeft");
  let index = 0;

  slider.style.setProperty("--n", itemsJson.data.recommendation.length);

  toggleRight.addEventListener("click", function() {
    if (index >= 0 && index < itemsJson.data.recommendation.length - 3) {
      index += 1;
      moveSlider(slider, index);
    } else {
      index = 0;
      moveSlider(slider, index);
    }
  });

  toggleLeft.addEventListener("click", function() {
    if (index >= 1 && index < itemsJson.data.recommendation.length - 2) {
      index -= 1;
      moveSlider(slider, index);
    } else {
      index = itemsJson.data.recommendation.length - 3;
      moveSlider(slider, index);
    }
  });
};

// This is the implementation of the X function from the JSONP request, it loads the JSONP information and calls the loadItems function to build the page as soon as the onload event is fired.
// Esta é a implementação da função X vinda como resposta da request pelo JSONP, ela carrega a informação do JSONP e chama a função loadItems para construir a página assim que o evento onload é disparado.
const X = itemsJson => {
  return (window.onload = () => loadItems(itemsJson));
};
