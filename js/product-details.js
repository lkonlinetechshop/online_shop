const products = [

{
id:10,

name:"Windows 7 Activation Key",

category:"Pc",

image:"images/win7.jpg",

oldPrice:1200,

price:984,

discount:"18%",

rating:"★★★★★",

stock:"In Stock",

description: 
    "Genuine Windows 7 Pro Key: A new, 100% genuine key for one PC. Permanent Activation: Provides a permanent, full activation for your current installation of Windows 7. ! IMPORTANT - PLEASE READ: This key is for the current installation only and cannot be reused after formatting Unlocks All Pro Features: Get full access to advanced security, BitLocker, Remote Desktop, and more. Global Key: Can be used and activated anywhere in the world."
},
    
{
id:9,

name:"Windows 11 Activation Key",

category:"Pc",

image:"images/win11.jpg",

oldPrice:1200,

price:984,

discount:"18%",

rating:"★★★★★",

stock:"In Stock",

description: 
    "Genuine Windows 11 Pro Key: A new, 100% genuine key for one PC. Permanent Activation: Provides a permanent, full activation for your current installation of Windows 11. ! IMPORTANT - PLEASE READ: This key is for the current installation only and cannot be reused after formatting Unlocks All Pro Features: Get full access to advanced security, BitLocker, Remote Desktop, and more. Global Key: Can be used and activated anywhere in the world."
},
    
{
id:8,

name:"Windows 10 Activation Key",

category:"Pc",

image:"images/win10.jpg",

oldPrice:1200,

price:984,

discount:"18%",

rating:"★★★★★",

stock:"In Stock",

description: 
    "Genuine Windows 10 Pro Key: A new, 100% genuine key for one PC. Permanent Activation: Provides a permanent, full activation for your current installation of Windows 10. ! IMPORTANT - PLEASE READ: This key is for the current installation only and cannot be reused after formatting Unlocks All Pro Features: Get full access to advanced security, BitLocker, Remote Desktop, and more. Global Key: Can be used and activated anywhere in the world."
},
    
{
id:7,

name:"Logitech G102 USB Wired Gaming Mouse 8000 DPI For PC/Mac Computer and Laptop",

category:"Pc",

image:"images/g102.jpg",

oldPrice:2480,

price:1959,

discount:"21%",

rating:"★★★★★",

stock:"In Stock",

description:
"Make the most of your game time with G102 gaming mouse, featuring LIGHTSYNC technology, a gaming-grade sensor and a classic 6-button design. Light up your game and your desk."

},    

    
{
id:1,

name:"RichAuto A11E 3 Axis CNC Controller",

category:"CNC parts",

image:"images/RichAuto_A11E.jpg",

oldPrice:126500,

price:115000,

discount:"10%",

rating:"★★★★★",

stock:"In Stock",

description:
"For RichAuto A11 CNC Controller A11S A11E A11C 3 Axis Motion Controller Remote for CNC Engraving Cutting English Suitable for 3 axis."

},


{
id:3,

name:"4 Axis CNC Breakout Board For Mach3",

category:"CNC parts",

image:"images/mach3.jpg",

oldPrice:5985,

price:5700,

discount:"5%",

rating:"★★★★☆",

stock:"In Stock",

description:
"Support for 4-axis linkage, you can connect four stepper motor drives or servo drives.Maximum step-pulse frequency is 100KHz, which is suitable for the servo or stepping motor.Support automatic probe tool.Support emergency input.Support for limit switch.Support for connecting electronic hand wheel.Need use external 24V DC power supply to isolate USB and external port, and to make the system more stable.Have 0-10V output port, you can use MACH3 software to control the spindle motor speed.4 general-purpose inputs, you can connect the limit switch, estop switch, probe switch, back to zero and device.4 general-purpose isolated relay drive output interface, can drive four relays for controlling the spindle starts, forward rotating and reverse rotating, pumps and device.Status LED, indicate connection status on the board."

},


{
id:2,

name:"Cloned RichAuto A11 3 Axis 0501 DSP CNC Controller",

category:"CNC parts",

image:"images/cloned_richauto_a11.jpg",

oldPrice:67200,

price:60000,

discount:"12%",

rating:"★★★★★",

stock:"In Stock",

description:
"A11E is the English-language version and uses the same operational workflow as the legacy 0501."

},

{
id:4,

name:"Arduino UNO Original Development Board with USB Cable",

category:"Electronics",

image:"images/unooriginal.jpg",

oldPrice:2448,

price:2400,

discount:"2%",

rating:"★★★★★",

stock:"In Stock",

description:
"The Arduino UNO is the most widely used and documented development board in the Arduino ecosystem. Based on the ATmega328P microcontroller, it offers 14 digital I/O pins, 6 analog inputs, and USB connectivity for programming and serial communication. Ideal for beginners and professionals alike."

},
    
{
id:5,

name:"Arduino UNO Normal Development Board with USB Cable",

category:"Electronics",

image:"images/unonormal.jpg",

oldPrice:1275,

price:1250,

discount:"2%",

rating:"★★★★★",

stock:"In Stock",

description:
"Arduino UNO R3 SMD is the open source Embedded Development board launched by Arduino based on Atmega328 SMD Package Microcontroller. Because Atmel is moving more and more of their production capacity to surface mount ICs, the DIP packaged ATmega is becoming more and more difficult to get. To keep up with demand, we now offer the Arduino Uno R3 with an SMD ATmega. The board is identical to the PTH version of the Uno, but you won't be able to remove the ATmega without some hot-air. This change shouldn't affect most users."

},


{
id:6,

name:"Smart String Hopper Making machine (800pcs per hour)Without Compressure",

category:"Machineries",

image:"images/smartstringhopper.jpg",

oldPrice:77700,

price:74000,

discount:"5%",

rating:"★★★★★",

stock:"In Stock",

description:
"A durable and easy-to-operate machine designed for efficient and consistent production applications. Featuring a stainless-steel working area, adjustable controls, and compact construction, it is ideal for food processing applications, and small-scale manufacturing."

},


];



// Get Product ID from URL

const urlParams = new URLSearchParams(window.location.search);

const id = Number(urlParams.get("id"));


// Find Product

const product = products.find(
p => p.id === id
);



const container =
document.getElementById("product-details");



if(product){


container.innerHTML = `


<div class="product-details">


<div>

<img src="${product.image}">

</div>



<div class="product-info">


<span class="discount">

-${product.discount}

</span>


<h1>

${product.name}

</h1>



<p class="category">

${product.category}

</p>



<div class="rating">

${product.rating}

</div>



<p class="price">

<del>

Rs.${product.oldPrice.toLocaleString()}

</del>


<strong>

Rs.${product.price.toLocaleString()}

</strong>


</p>



<span class="stock">

${product.stock}

</span>



<p class="product-description">

${product.description}

</p>



<div class="quantity-box">

    <button
        type="button"
        onclick="changeQty(-1)">
        -
    </button>


    <input
        id="qty"
        type="number"
        value="1"
        min="1"
        readonly
    >


    <button
        type="button"
        onclick="changeQty(1)">
        +
    </button>

</div>


<button
    type="button"
    class="add-cart buy-btn"
    onclick="addToCart()">

    <i class="fa-solid fa-cart-shopping"></i>
    <a href="index.html">
    </a>

    Add To Cart

</button>

</div>

`;



}
else{


container.innerHTML =
"<h2>Product Not Found</h2>";


}




function changeQty(value) { 
    const qtyInput = document.getElementById("qty"); 
    
    if (!qtyInput) { 
        console.log("Quantity input not found!"); 
        return; 
    } 
    let currentQty = parseInt(qtyInput.value) || 1;
     currentQty = currentQty + value; 
     // Minimum quantity = 1 
      if (currentQty < 1) {
         currentQty = 1; 
        } 
        qtyInput.value = currentQty; 
        console.log("Quantity:", currentQty); 
    }

// ======== // ADD TO CART // ==================== 
function addToCart() {
     if (!product) {
         return; 
        } 
        // IMPORTANT: // Get the current quantity from input
         const qtyInput = document.getElementById("qty"); 
         const quantity = parseInt(qtyInput.value) || 1; 
         console.log("Adding quantity:", quantity); 
          window.location.href = "index.html";
         // Get existing cart 
         let cart = JSON.parse( 
            localStorage.getItem("cart") 
        ) || []; 
        // Check existing product 
        const existingProduct = cart.find( 
            item => item.id === product.id 
        ); 
        if (existingProduct) { 
            existingProduct.quantity += quantity; 
        } else { 
            cart.push({ 
                id: product.id,
                 name: product.name, 
                 price: product.price, 
                 image: product.image, 
                 quantity: quantity 
                }); 
            } 
            // Save cart 
            localStorage.setItem(
                 "cart",
                  JSON.stringify(cart) 
                ); 
                alert( 
                    product.name + 
                    " x " + 
                    quantity + 
                    " added to cart!" 
                ); 
            }
