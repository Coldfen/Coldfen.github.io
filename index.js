const ROOT_MENU__PAGE = document.getElementById("menu__page");
const ROOT_HEADER = document.getElementById("header");
const ROOT_MENU__PIZZA_EDITOR = document.getElementById("menu__pizza-editor");
const ROOT_SHOPPING_CARD = document.getElementById("shopping-card");
const ROOT_ORDER_CONFIRM = document.getElementById("order-confirm");
const ROOT_PRELOADER = document.getElementById("preloader");
const ROOT_ERROR = document.getElementById("error");
const ROOT_ORDER_ACCEPT = document.getElementById("order-accept")

class Preloader {
  preloaderClear(){
    ROOT_PRELOADER.innerHTML = ``;
  } 

   preloaderRender(){
    const html = `
      <div class="preloader-container">
          <img class = "preloader__img " src="src/img/Preloader.svg"/>
      </div>
    `;

    ROOT_PRELOADER.innerHTML = html;

   }
}


const preloaderPage = new Preloader();

let CATALOG = [];

preloaderPage.preloaderRender();

fetch("http://myjson.dit.upm.es/api/bins/7l03")
.then(res => res.json())
.then(body => {
  CATALOG = body;
  preloaderPage.preloaderClear();
  render();
})
.catch(error =>{
  preloaderPage.preloaderClear();
  console.log(error)
  errorPage.errorRender();
});


function render (){

  const productsStore = localStorageUtil.getProducts();

  headerPage.headerRender( productsStore.length);
  productsPage.render();
  

  


}


class Products {
  render(){

    
     let htmlCatalog =``;

    CATALOG.forEach(({ id, name,  price, composition, img }) => {
      htmlCatalog += `
       <li class = "products-element ">
         <img class = "products-element__img" src="${img}" />
         <span class = "products-element__name">${name}</span>
         <span class = "products-element__composition"><b>Состав:</b> ${composition}</span>
         <button class = "products-element__btn"  onclick="shoppingCard.shoppingCardRender(this,'${id}');" >${price} <i class="fa fa-rub" aria-hidden="true"></i></button>
       </li>
      
      `;
    });

      const html = `
      <ul class = "products-container">
      ${htmlCatalog}
      </ul>
      `;

      ROOT_MENU__PAGE.innerHTML = html;

      
  }

 
   
}




class LocalStorageUtil {
  constructor(){
    this.keyName = 'products';
  }

  getProducts(){
     const productsLocalStorage = localStorage.getItem(this.keyName);

     if(productsLocalStorage !== null){
       return JSON.parse(productsLocalStorage);
     }
      return[];

  };
   
    putProducts(id) {
        const productsInCart = this.getProducts();
        const productToAdd = productsInCart.find(product => product.id == id);

        if (productToAdd) {
          productToAdd.quantity += 1;
        } else {
          productsInCart.push({
            id,
            quantity: 1,
          })
        }

        localStorage.setItem(this.keyName,JSON.stringify(productsInCart));

        return productsInCart 
    }


    productDellAll(){
      let productsInCart = this.getProducts();

      productsInCart = [];

       let products = productsInCart;

      localStorage.setItem(this.keyName,JSON.stringify(products));
      menuPizzaEditor.shoppingRender();
      headerPage.headerRender(products.length);
      return products;

      
    }

    changeQuantity(id,hendler) {
      const productsInCart = this.getProducts();
      const product = productsInCart.find(product => product.id == id);
      if(hendler == "increase" && product.quantity !== 0) {
        product.quantity += 1
      }if(hendler !== "increase" && product.quantity !== 0){
        product.quantity -= 1
       }if(product.quantity == 0){
        let products = this.getProducts();

        products = products.filter(product => product.id != id )
  
        localStorage.setItem(this.keyName,JSON.stringify(products));
        menuPizzaEditor.shoppingRender();
        headerPage.headerRender(products.length);
        return products;
        }

      

      localStorage.setItem(this.keyName,JSON.stringify(productsInCart));
      menuPizzaEditor.shoppingRender();

    }

    

    delProducts(id){
      let products = this.getProducts();

      products = products.filter(product => product.id != id )

      localStorage.setItem(this.keyName,JSON.stringify(products));
      menuPizzaEditor.shoppingRender();
      headerPage.headerRender(products.length);
      return products;
    }
}

class Header {
    handlerOpenMenuPizzaEditor(){
      menuPizzaEditor.shoppingRender();
    }

  headerRender(count){
    const headerHtml = `
     <div class = "header-container">
        <div class = "header-counter" onclick = "headerPage.handlerOpenMenuPizzaEditor();">
        🛒${count}
        </div>
        <p class = "header-container__logo">Pizza Dev</p>
     </div>
    
    `;

    ROOT_HEADER.innerHTML = headerHtml;
  }


}


class Shopping  {
      handleClear(){
        ROOT_MENU__PIZZA_EDITOR.innerHTML = ``;
      }

              hendlerOpenOrderConfirm(){
                orderConfirm.orderConfirmRender();
              };


      shoppingRender(){
      
        const productsStore = localStorageUtil.getProducts();
        let htmlCatalog = ``;
        let sumCatalog = 0;

        htmlCatalog = productsStore.reduce((acc, curId) => { 
          const product = CATALOG.find(item => item.id === curId.id) 
          if (product) { 
              const totalPriceByProduct = curId.quantity *+ product.price;
              
              
              acc+= `<tr>
                <td class = "shopping-element__name">🍕${product.name}</td>
                <td class = "shopping-element__price">${product.price} <i class="fa fa-rub" aria-hidden="true"></i></td>
                <td><button class="shopping-element__btn_calck"" onclick="localStorageUtil.changeQuantity('${product.id}','${'decrease'}')"><i class="fas fa-minus-square"></i></button></td>
                <td class = "shopping-element__name">${curId.quantity}</td>
                <td><button class="shopping-element__btn_calck" onclick="localStorageUtil.changeQuantity('${product.id}', '${'increase'}')"><i class="fas fa-plus-square"></i></button></td>
                <td class = "shopping-element__name">Итого:</td>
                <td class = "shopping-element__name_calk">${totalPriceByProduct} <i class="fa fa-rub" aria-hidden="true"></td>
                <td><button class="shopping-element__btn_calck" onclick="localStorageUtil.delProducts('${product.id}')">Удалить</button></td>
                <td></td>
              </tr>`;
          
              sumCatalog += totalPriceByProduct; 
               
              return acc; 
          } 
      }, ``);
        
     

        const html = `
        <div class = "shopping-container">
                            <div class="shopping__close" onclick="menuPizzaEditor.handleClear();"> </div>
                            <table>
                            ${htmlCatalog}
                                <tr>
                                  <td class = "shopping-element__name">💰Сумма:</td>
                                  <td class = "shopping-element__price__sum">${sumCatalog} <i class="fa fa-rub" aria-hidden="true"></i></td>
                                </tr>
                            </table>
                            <button class = "shopping-element__btn" onclick ="menuPizzaEditor.hendlerOpenOrderConfirm();">Заказать</button>
                    </div> `;
        
        
        ROOT_MENU__PIZZA_EDITOR.innerHTML = html;
      }

}

class Error {
  errorRender(){
      const html = `
        <div class = "error-container">
          <div class = "error-message">
          <h3>Ой,произошла ошибка</h3>
          <p class="error-message-text">Попробуйте зайти позже</p>
          </div>
        </div> 
          `;

      ROOT_ERROR.innerHTML = html;
  }
  
}

class ShoppingCard {

  shoppingCardClose(){
    ROOT_SHOPPING_CARD.innerHTML = ``
  };
    

  handleAddLocalStorege(id){
    const products = localStorageUtil.putProducts(id)
    


    headerPage.headerRender(products.length);
  };

  shoppingCardRender(element,id){
     

    

    let html = ``;
    let elementId = id;

    CATALOG.forEach(({ id, name,  price, composition,weight, img,Val:{protein,fat,carb,cal} }) => {




      if(elementId === id){
        html = `  <div class = "shoppingCard-wrapper">
        <div class="shoppingCard__close" onclick="shoppingCard.shoppingCardClose();"> </div>
        <div class="shoppingCard__img-container"><img class="shoppingCard__img" src="${img}" />
        <div class = "shoppingCard__info">
        <p><span>Б</span>${protein}</p>
        <p><span>Ж</span>${fat}</p>
        <p><span>У</span>${carb}</p>
        <p><span>К</span>${cal}</p>
        </div>
        </div>
        <div class = "shoppingCard__content-container">
        <h4>${name}</h4>
        <div class="shoppingCard__composition"><b>Состав:</b>${composition}<p><b>Вес: </b>${weight}</p></div>
        
        <button class="shoppingCard__btn" onclick="shoppingCard.handleAddLocalStorege('${id}');">${price} <i class="fa fa-rub" aria-hidden="true"></i></button>
        </div>
  </div>`;
      }
    });
    
      ROOT_SHOPPING_CARD.innerHTML = html;

   

  }

  btnActiveClassAdd(element) {
     
    let idEvntBtn =  element.id;
    
    if(idEvntBtn == id1 ){
      element.classList.add(this.classNameActive);
    }
   };

}


class OrderConfirm{

  hendlerClearOrderConfirm(){
    ROOT_ORDER_CONFIRM.innerHTML = ``;
  };

  orderConfirmRender(){
    const html = `
    <div class = "orderConfirm-form">
    <div class="orderConfirm__close" onclick="orderConfirm.hendlerClearOrderConfirm();"> </div>
    <span class="orderConfirm__info">Введите данные для подтверждения заказа</span>
    <p>введите ФИО:</p> <input class="orderConfirm__input" type="text">
     <p>введите номер телефона:</p> <input class="orderConfirm__input" type="tel">
      <p>введите email: </p><input class="orderConfirm__input" type="email">
      <p>введите адрес:</p> <input class="orderConfirm__input" type="text">
      <div>
      <p>выберите способ оплаты:</p>
      <input type="radio" id="pay1"
      name="pay" >
     <label for="contactChoice1">Наличные</label>
      <input type="radio" id="pay2"
      name="pay" >
     <label for="contactChoice2">Картой</label>
     </div>
      <button class = "orderConfirm__btn" onclick = "orderAccept.OrderAcceptMessage();">Подтвердить</button>
    </div>`;


    ROOT_ORDER_CONFIRM.innerHTML = html;
  }


}


class OrderAccept {


  close(){
    ROOT_ORDER_ACCEPT.innerHTML = ``;
  }

  render(){

    const html = `
    <div class = "order-accept__message">
    <p>Спасибо за ваш заказ!</p>
    <p>Мы уже начали готовить его🍕</p>
    </div>
    `;

  ROOT_ORDER_ACCEPT.innerHTML = html;

  }

  
  OrderAcceptMessage(){
    this. render();
    localStorageUtil.productDellAll();
    orderConfirm.hendlerClearOrderConfirm();
    menuPizzaEditor.handleClear();
    setTimeout(this.close,5000);
  }


  

}

const localStorageUtil = new LocalStorageUtil();

const orderConfirm = new OrderConfirm();

const shoppingCard = new ShoppingCard();

const menuPizzaEditor = new Shopping();

const headerPage = new Header();

const productsPage = new Products();

const orderAccept = new OrderAccept();

const errorPage = new Error();

















