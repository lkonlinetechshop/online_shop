function filterProducts(category){

    const cards =
    document.querySelectorAll(".card");

    cards.forEach(card => {

        if(
            category === "All" ||
            card.dataset.category === category
        ){
            card.style.display = "block";
        }else{
            card.style.display = "none";
        }

    });

}