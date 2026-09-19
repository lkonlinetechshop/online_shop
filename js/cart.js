
// ===============================
// TECH STORE CART SYSTEM
// ===============================


let cart =
    JSON.parse(localStorage.getItem("cart")) || [];


// ===============================
// ADD TO CART
// ===============================

document.addEventListener(
    "click",
    function (e) {

        console.log(e.target);


        if (!e.target.closest(".add-cart")) {
            return;
        }


        console.log("Button clicked");


        const button =
            e.target.closest(".add-cart");


        // ===============================
        // GET QUANTITY
        // ===============================

        const qtyInput =
            document.getElementById("qty");


        const quantity =
            qtyInput
                ? parseInt(qtyInput.value) || 1
                : 1;


        // ===============================
        // GET SELECTED BIT SIZE
        // ===============================

        const selectedBit =
            document.querySelector(
                'input[name="bitSize"]:checked'
            );


        let selectedSize = null;

        let selectedPrice =
            Number(button.dataset.price);


        if (selectedBit) {

            selectedSize =
                selectedBit.value;


            selectedPrice =
                Number(
                    selectedBit.dataset.price
                );

        }


        console.log(
            "Selected Size:",
            selectedSize
        );


        console.log(
            "Selected Price:",
            selectedPrice
        );


        // ===============================
        // CREATE PRODUCT
        // ===============================

        const product = {

            id: button.dataset.id,

            name: button.dataset.name,

            price: selectedPrice,

            image: button.dataset.image,

            quantity: quantity,

            bitSize: selectedSize

        };


        console.log(
            "Product:",
            product
        );


        // ===============================
        // GET CART
        // ===============================

        let cart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];


        // ===============================
        // CHECK SAME PRODUCT + SAME SIZE
        // ===============================

        const existingProduct =
            cart.find(
                item =>
                    item.id === product.id &&
                    item.bitSize === selectedSize
            );


        // ===============================
        // UPDATE QUANTITY
        // ===============================

        if (existingProduct) {

            existingProduct.quantity +=
                quantity;

        }

        else {

            cart.push(product);

        }


        // ===============================
        // SAVE CART
        // ===============================

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );


        // Update global cart variable
        window.cart = cart;


        // ===============================
        // UPDATE CART COUNT
        // ===============================

        updateCartCount();


        // ===============================
        // MESSAGE
        // ===============================

        alert(

            product.name +

            "\nBit Size: " +

            (
                selectedSize ||
                "Standard"
            ) +

            "\nPrice: Rs." +

            selectedPrice.toLocaleString() +

            "\nQuantity: " +

            quantity +

            "\n\nAdded to cart!"

        );

    }

);


// ===============================
// UPDATE CART ICON NUMBER
// ===============================

function updateCartCount() {


    let count = 0;


    cart.forEach(
        item => {

            count +=
                Number(item.quantity) || 0;

        }
    );


    const cartCount =
        document.querySelector(
            ".cart-count"
        );


    if (cartCount) {

        cartCount.textContent =
            count;

    }

}


// ===============================
// INITIAL CART COUNT
// ===============================

updateCartCount();

