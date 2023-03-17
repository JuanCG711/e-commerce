async function getProducts(){
    try{
        const data = await fetch("https://ecommercebackend.fundamentos-29.repl.co/");
        const res = await data.json();
        window.localStorage.setItem("products",JSON.stringify(res));
        return res;
    }catch(error){
        console.log(error);
    }
}

function headerPermanent(){
    let header = document.getElementById("header-home");
    window.addEventListener("scroll", () =>{
        let scroll = window.scrollY
        if(scroll > 10){
            header.style.backgroundColor = "#ffffff";
        } else{
            header.style.backgroundColor = "transparent"
        }
    })
}

function printProducts(db){
    const productsHTML = document.querySelector(".products");
    let html = "";
    for (const product of db.products) {
        const buttonAdd =  product.quantity? `<i class='bx bx-plus' id = "${product.id}"></i>`:
        "<span class='soldOut'>Sold Out</span>";
        html += `
        <div class="product">
        <div class="product__image">
            <img src="${product.image}" alt="imagen" />
        </div>
        <div class="product__info">
        <h4>${product.name}|<span><b>Stock</b>: ${product.quantity} </span> </h4>
        <h5>
            $${product.price}.00
            ${buttonAdd}
           
            
        </h5>
    </div>
            
        </div>
        `;
        
    }
   
   
    productsHTML.innerHTML = html;
}

function handleShowCart(){
    const icontHTML = document.querySelector(".bx-cart");
    const carHTML = document.querySelector(".cart");

    let count = 0;
    icontHTML.addEventListener("click",function(){
        carHTML.classList.toggle("cart__show");
    });

}

function addCartFromProducts(db){
    const productsHTML = document.querySelector(".products");

    productsHTML.addEventListener("click", function(e){
        if(e.target.classList.contains("bx-plus")){
            const id = Number(e.target.id);

            const productFind = db.products.find((product) => product.id === id);

            if(db.cart[productFind.id]){
                if(productFind.quantity === db.cart[productFind.id].amount)
                    return alert ("no hay mas mi rey");
                db.cart[productFind.id].amount++;
            }else{
                db.cart[productFind.id] = { ...productFind, amount: 1};
            }

            window.localStorage.setItem("cart", JSON.stringify(db.cart));
            printProductsIncart(db);
            printTotal(db);
            handlePrintAmountProducts(db);
        }
    });

}

function printProductsIncart(db){
    const cartProducts = document.querySelector(".cart__products");
    let html = "";
    for (const product in db.cart) {
         const{quantity,price,name,image,id,amount} =db.cart[product];

      
         html += `
            <div class="cart__product">
                <div class="cart__product--img">
                    <img src="${image}" alt = "imagen" />
                </div>
                <div class="cart__product--body">
                  <h4>${name} | $${price}.00</h4>
                    <p>Stock: ${quantity}</p>

                    <div class="cart__product--body-op" id="${id}">
                        <i class='bx bx-minus'></i>
                        <span>${amount}unit</span>
                        <i class='bx bx-plus'></i>
                        <i class='bx bx-trash'></i>
                    </div>
                </div>
            </div>
         `;
        }
        cartProducts.innerHTML = html;
  
}

function handleProductsIncart(db){
    const cartProducts = document.querySelector(".cart__products");
    cartProducts.addEventListener("click",function(e){
        if(e.target.classList.contains("bx-plus")){
            const id = Number(e.target.parentElement.id);

            const productFind = db.products.find((product) => product.id === id);
            if(productFind.quantity === db.cart[productFind.id].amount)
            return alert ("no hay mas mi rey");
            db.cart[id].amount++;

        }
        if(e.target.classList.contains("bx-minus")){
            const id = Number(e.target.parentElement.id);
            if(db.cart[id].amount ===1){
                const response = confirm("Estas seguro de lo que va hacer mi papacho?");
                
                if(!response) return;
                delete db.cart[id];
            }else{
                db.cart[id].amount--;
            }
            

        }
        if(e.target.classList.contains("bx-trash")){
            const id = Number(e.target.parentElement.id);
            const response = confirm("Estas seguro de lo que va hacer mi papacho?");
           
            if(!response) return;
            delete db.cart[id];

        }
        window.localStorage.setItem("cart",JSON.stringify(db.cart));
        printProductsIncart(db);
        printTotal(db);
        handlePrintAmountProducts(db);
    });

}

function printTotal(db){
    const infoTotal = document.querySelector(".info__total");
    const infoAmount = document.querySelector(".info__amount");

    let totalProducts = 0;
    let amountProducts = 0;

    for (const product in db.cart) {
        const{amount, price} = db.cart[product];
        totalProducts += price*amount;
        amountProducts += amount;
        
    }
   
    infoTotal.textContent = "$" + totalProducts +".00";
    
    if(amountProducts ===1){
        infoAmount.textContent = amountProducts +" item";
    }else{
        infoAmount.textContent = amountProducts +" items";
    }
    
}

function handleTotal(db){
    const btnBuy = document.querySelector(".btn__buy");

    btnBuy.addEventListener("click", function(){
        if(!Object.values(db.cart).length)
            return alert("y entonces no va comprar nada?");

        const response = confirm("seguro mi fafa?");
        if(!response)return;

        const currentProducts = [];

        for (const product of db.products) {
            const productCart = db.cart[product.id]
            if(product.id === productCart?.id){
                currentProducts.push({
                    ...product,
                    quantity: product.quantity - productCart.amount
                });
            } else{
                currentProducts.push(product);
            }
          
        }

        db.products = currentProducts;
        db.cart = {};

        window.localStorage.setItem("products", JSON.stringify( db.products));
        window.localStorage.setItem("cart", JSON.stringify(db.cart));

        printTotal(db);
        printProductsIncart(db);
        printProducts(db);
        handlePrintAmountProducts(db);
    });
}

function handlePrintAmountProducts(db){
    
    const amountProducts = document.querySelector(".amountProducts");

    let amount = 0;
    for (const product in db.cart) {
        amount += db.cart[product].amount;
       
        }

        amountProducts.textContent = amount;
}
async function main(){ 
    const db = {
        products: JSON.parse(window.localStorage.getItem("products")) || (await getProducts()),
        cart: JSON.parse(window.localStorage.getItem("cart")) || {},
    };
   
    printProducts(db);
    handleShowCart();
    addCartFromProducts(db);
    printProductsIncart(db);
    handleProductsIncart(db);
    printTotal(db);
    handleTotal(db);
    handlePrintAmountProducts(db);
    
    }
   
  
  

main();
