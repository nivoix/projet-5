let products = [];
let basket = getBasket();
// récupérer le panier
function getBasket() {
    let basket = localStorage.getItem("basket");
    if(basket == null){
        document.querySelector('h1').textContent = "Votre panier est vide";
    }else{
        return JSON.parse(basket)
    }
}
//enregistrer le panier
function saveBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket));
}

// changement de quantité d'un produit
function changeQuantity(){
    let lastQuantity =  document.querySelectorAll(".itemQuantity");
    for(let v = 0; v < lastQuantity.length; v++){
        let lastValueQuantity = lastQuantity[v];
        lastValueQuantity.addEventListener ("change", function (e) {
            let eArticle = lastQuantity[v].closest("article");
            let eId = eArticle.getAttribute("data-id");
            let eColor = eArticle.getAttribute("data-color");
            let alertQuantity = `<div  id="alertQuantity" style="color:red; font-size:16px; text-align:center; font-weight:bold"; ></div>`
            document.querySelector('#cart__items').insertAdjacentHTML("beforebegin", alertQuantity);
            let quantite = Math.floor(e.target.value)
            if(e.target.value < 0) {
                    document.getElementById('alertQuantity').innerHTML = 'Veuillez saisir une quantité entre 1 et 100';
                } else{
                    document.getElementById('alertQuantity').innerHTML = '';
                    let product = {
                        id: eId,
                        colorChoice: eColor,
                        quantity: quantite
                    }
                    editProductLocalStorage(product);
                    totalQuantityFromBasket ();
                    totalPriceFromBasket();
                }
        });
    }
}
//Ajout de produits dans LS
function editProductLocalStorage(product) {
    let basket = getBasket();
    let foundProductIndex = basket.findIndex((i) => i.id === product.id && i.colorChoice === product.colorChoice);
    if(foundProductIndex != -1){
        basket[foundProductIndex].quantity = product.quantity;
    }
    saveBasket(basket);
}
// quantité total de produit  
function totalQuantityFromBasket () {
    let basket = getBasket();
    let number = 0;
    for (let product of basket) {
        number += parseInt(product.quantity);
        let totalQuantity = document.getElementById('totalQuantity');
        totalQuantity.textContent = number;
    }
}
// prix total du panier
function totalPriceFromBasket () {
    let basket = getBasket();
    let price = 0;
    for(let product of basket) {
        for(let p = 0; p < products.length; p++) {
            if(product.id === products[p]._id){
                price += products[p].price * product.quantity;
                let totalPrice = document.getElementById('totalPrice');
                totalPrice.textContent = price; 
            }
        }
    }
}
// suprimer un produit
function removeProduct () {
    let remove = document.getElementsByClassName('deleteItem');
    for(let r = 0; r < remove.length; r++){
        remove[r].addEventListener('click', () => {
            let eArticle = remove[r].closest("article");
            let eId = eArticle.getAttribute("data-id");
            let eColor = eArticle.getAttribute("data-color");
            let product = {
                id: eId,
                colorChoice: eColor,
            }
            deleteFromBasket(product)
        })
    }
}
//suppression de produits dans LS
function deleteFromBasket(product) {
    let basket = getBasket();
    basket = basket.filter(d => (d.id != product.id) || (d.colorChoice != product.colorChoice))
    saveBasket(basket);
    if(basket.length != 0){
        location.reload()
    }else{
        localStorage.removeItem('basket');
        location.reload()
    }     
}
fetch(`http://localhost:3000/api/products`)
.then((res) => res.json())
.then((data) => {
    products = data;
    for(let x = 0; x < basket.length; x++) {
        let basket = getBasket();
            for(let y = 0; y < data.length; y++){
                if(basket[x].id === data[y]._id){
                let display = ''
                display += `<article class="cart__item" data-id=${basket[x].id} data-color=${basket[x].colorChoice}>
                <div class="cart__item__img"><img src="${data[y].imageUrl}" alt="${data[y].description}"></div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${data[y].name}</h2>
                        <p>${basket[x].colorChoice}</p>
                        <p>${data[y].price}€</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${basket[x].quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <br>
                            <p class="deleteItem">Supprimer</p>
                        </div>
                      </div>
                    </div>
                  </article>`
                document
                    .getElementById("cart__items")
                    .insertAdjacentHTML("afterbegin", display);        
                }
            }
        }
// changement de quantité d'un produit
    changeQuantity();
// changement de quantité total de produit
    totalQuantityFromBasket();
// prix total du panier
    totalPriceFromBasket();
// supprimer product
    removeProduct();
});

//*****************************************formulaire ************************************/
// sélection du bouton envoyer le formulaire
const btnsendform = document.getElementById("order");
btnsendform.addEventListener('click', (e) => {
    e.preventDefault();
// récupérer les valeurs du formulaire
    const contact = {
        firstName : document.querySelector("#firstName").value,
        lastName : document.querySelector("#lastName").value,
        address : document.querySelector("#address").value,
        city : document.querySelector("#city").value,
        email : document.querySelector("#email").value
    }
// controle des infos du formulaire
    regexprenom= /^([^ ])(([A-Za-zÀ-ÿœ]{2,40})?(['.\ -]{0,5}))*$/;
    msgprenom = "Les chiffes et symboles sont interdits.Maximum 40 caractères, minimum 3 caractères";
    regexnom= /^([^ ])(([a-zA-ZÀ-ÿœ\,\'\.\ \-]{2,30}))*$/;
    msgnom = `Les chiffes et symboles sont interdits.Maximum 30 caractères, minimum 2 caractères`;
    regexaddress= /^([^ ])([0-9a-zA-ZÀ-ÿœ\,\-\'\.\ ]*)$/;
    msgaddress = `Les caractères spéciaux sont interdits.`;
    regexcity= /^([^ ])([a-zA-ZÀ-ÿœ\,\-\'\.\ ]*){1,45}$/;
    msgcity = `Les chiffres et caractères spéciaux sont interdits.`;
    regexemail= /^([^ ])[a-zA-Z0-9_.+-]+@[a-zA-Z]+\.[a-z]{2,4}$/;
    msgemail = `Veuillez indiquer une adresse email valide`;
    function checkinput (regex, msg, inputValue, inputError) {
        if(regex.test(inputValue)) {
            document.getElementById(inputError + 'ErrorMsg').textContent =""
            return true
        }else {
            document.getElementById(inputError + 'ErrorMsg').textContent = msg
            return false
        }
    }
    checkinput (regexprenom, msgprenom, contact.firstName, "firstName")
    checkinput (regexnom, msgnom, contact.lastName, "lastName")
    checkinput (regexaddress, msgaddress, contact.address, "address")
    checkinput (regexcity, msgcity, contact.city, "city")
    checkinput (regexemail, msgemail, contact.email, "email")
// contrôle si formulaire valide
    function checkFormulaire () {
        if(checkinput (regexprenom,msgprenom, contact.firstName, "firstName" ) 
        && checkinput (regexnom, msgnom, contact.lastName, "lastName" ) 
        && checkinput (regexaddress, msgaddress, contact.address, "address") 
        && checkinput (regexcity, msgcity, contact.city, "city") 
        && checkinput (regexemail, msgemail, contact.email, "email")) {
            return true
        }else{
            return false
        }
    }
    checkFormulaire ()
// panier des id de chaque produit choisit
    let products = []
    if(basket != undefined){
        for (c = 0; c < basket.length; c++){
            products.push(basket[c].id)
        }
    }else{
        alert('votre panier est vide')
    }
// variable contenant le panier et le formulaire à envoyer pour la commande
    const order = {
        products,
        contact
    }
//verif conditions avant envoi de la commande
    if(basket != undefined && checkFormulaire () ){
        sendOrder()
    }
//envoi des données à l'API
    function sendOrder () {
        fetch("http://localhost:3000/api/products/order",{
            method: "POST",
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(order),
        })
        .then((res) => res.json())
        .then((data) => {
//redirection vers la page confirmation
            document.location.href = `confirmation.html?orderId=${data.orderId}`;
        })
        .catch((error) => {
            alert("Un problème a été rencontré lors de l'envoi de la commande");
            return error;
        });
    }
})