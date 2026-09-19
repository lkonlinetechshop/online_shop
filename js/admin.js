import { initializeApp }
from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
deleteDoc,
doc,
updateDoc
}
from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

import {
getStorage,
ref,
uploadBytes,
getDownloadURL
}
from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";

const firebaseConfig = {

apiKey:"YOUR_API_KEY",
authDomain:"YOUR_DOMAIN",
projectId:"YOUR_PROJECT_ID",
storageBucket:"YOUR_BUCKET"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

loadProducts();
loadOrders();

async function addProduct(){

const name =
document.getElementById("name").value;

const price =
Number(document.getElementById("price").value);

const stock =
Number(document.getElementById("stock").value);

const category =
document.getElementById("category").value;

const description =
document.getElementById("description").value;

const imageFile =
document.getElementById("image").files[0];

if(!imageFile){
alert("Select image");
return;
}

const imageRef =
ref(storage,
`products/${Date.now()}-${imageFile.name}`);

await uploadBytes(imageRef,imageFile);

const imageUrl =
await getDownloadURL(imageRef);

await addDoc(
collection(db,"products"),
{
name,
price,
stock,
category,
description,
image:imageUrl,
createdAt:new Date()
}
);

alert("Product Added");

location.reload();
}

async function loadProducts(){

const container =
document.getElementById("products");

container.innerHTML="";

const snapshot =
await getDocs(
collection(db,"products")
);

snapshot.forEach(product=>{

const data = product.data();

container.innerHTML += `
<div class="admin-card">

<img src="${data.image}">

<h3>${data.name}</h3>

<p>Rs. ${data.price.toLocaleString()}</p>

<p class="stock">
Stock: ${data.stock}
</p>

<div class="actions">

<button
class="edit-btn"
onclick="editStock('${product.id}')">
Update Stock
</button>

<button
class="delete-btn"
onclick="deleteProduct('${product.id}')">
Delete
</button>

</div>

</div>
`;

});
}

window.deleteProduct =
async function(id){

if(!confirm("Delete Product?"))
return;

await deleteDoc(
doc(db,"products",id)
);

location.reload();
}

window.editStock =
async function(id){

const newStock =
prompt("Enter new stock");

if(newStock === null)
return;

await updateDoc(
doc(db,"products",id),
{
stock:Number(newStock)
}
);

location.reload();
}

