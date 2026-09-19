// ===============================
// TECH STORE CART SYSTEM
// ===============================


let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add cart buttons
document.addEventListener(
    "click", 
    function(e){

console.log(e.target);

    if(e.target.closest(".add-cart")){
console.log("Button clicked");



        let button = e.target.closest(".add-cart");

        let product = {

            id: button.dataset.id,

            name: button.dataset.name,

            price: Number(button.dataset.price),

            image: button.dataset.image,

            quantity:quantity
                
             bitSize: selectedSize

            
        };
        
        console.log( 
            "Product:", 
            product 
        );
            // Get selected bit size

    const selectedSize =
        document.querySelector(
            'input[name="bitSize"]:checked'
        );

// Selected price 
        let selectedPrice = 
            product.price; 
        let selectedSize = null; 
        if (selectedBit) { 
            selectedSize = 
                selectedBit.value; 
            selectedPrice = Number( 
                selectedBit.dataset.price ); }
        // Existing cart 
        let cart = JSON.parse( localStorage.getItem("cart") ) || []; 
        // Check same product + same bit size 
        const existingProduct = cart.find(item => item.id === product.id && item.bitSize === selectedSize );


        if(existing){

            existing.quantity += quantity;

        }
        else{

            cart.push(product);

        }


        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );


        updateCartCount();


        alert(
           product.name + 
            "\nBit Size: " +
            (selectedSize || "Standard") +
            "\nPrice: Rs." + 
            selectedPrice.toLocaleString() + 
            "\nQuantity: " + quantity +
            "\n\nAdded to cart!" );


    }

});





// Update cart icon number

function updateCartCount(){

    let count = 0;


    cart.forEach(
        item=>{

        count += item.quantity;

    });


    let cartCount =
    document.querySelector(".cart-count");


    if(cartCount){

        cartCount.innerHTML=count;

    }

}


updateCartCount();
