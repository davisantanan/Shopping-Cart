let cart = [];
let key = 0;
let modalQtd = 0;
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

modelsJson.map((item, index) => {
    let modelsItem = c('.models .models-item').cloneNode(true);
    modelsItem.setAttribute('data-key', index);
    modelsItem.querySelector('.models-item-img img').src = item.img;
    modelsItem.querySelector('.models-item-price').innerHTML = `R$ ${item.price[1].toFixed(2)}`;
    modelsItem.querySelector('.models-item-name').innerHTML = item.name;
    modelsItem.querySelector('.models-item-description').innerHTML = item.description;

    modelsItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        key = e.target.closest('.models-item').getAttribute('data-key');
        modalQtd = 1;
        c('.modelsBig img').src = modelsJson[key].img;
        c('.modelsInfo h1').innerHTML = modelsJson[key].name;
        c('.modelsInfo-description').innerHTML = modelsJson[key].description;
        c('.modelsInfo-size.selected').classList.remove('selected');
        cs('.modelsInfo-size').forEach((size, sizeIndex) => {
            if(sizeIndex == 1) {
                size.classList.add('selected');
                c('.modelsInfo-actualPrice').innerHTML = `R$ ${modelsJson[key].price[sizeIndex].toFixed(2)}`;
            };
            size.querySelector('span').innerHTML = modelsJson[key].sizes[sizeIndex];
            
        });
        c('.modelsInfo-qtd').innerHTML = modalQtd;
        c('.modelsWindowArea').style.opacity = 0;
        c('.modelsWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.modelsWindowArea').style.opacity = 1;
        }, 30);
        
    });
    c('.models-area').append(modelsItem);
});

function closeModal() {
    setTimeout(() => {
        c('.modelsWindowArea').style.display = 'none';
    }, 30);
}
c('.modelsInfo-cancelButton').addEventListener('click', closeModal);
c('.modelsInfo-cancelMobileButton').addEventListener('click', closeModal);

c('.modelsInfo-qtdMenos').addEventListener('click', ()=> {
    if(modalQtd > 1) {
        modalQtd--;
        c('.modelsInfo-qtd').innerHTML = modalQtd;
    }
});
c('.modelsInfo-qtdMais').addEventListener('click', ()=> {
    modalQtd++;
    c('.modelsInfo-qtd').innerHTML = modalQtd;
});

cs('.modelsInfo-size').forEach((size, sizeIndex) => {
    size.addEventListener('click', () => {
        c('.modelsInfo-size.selected').classList.remove('selected');
        size.classList.add('selected');
        c('.modelsInfo-actualPrice').innerHTML = `R$ ${modelsJson[key].price[sizeIndex].toFixed(2)}`;
    });
});

c('.modelsInfo-addButton').addEventListener('click', () => {
    let size = parseInt(c('.modelsInfo-size.selected').getAttribute('data-key'));
    let identifier = modelsJson[key].id+'@'+size;
    let locaId = cart.findIndex((item) => item.identifier == identifier);
    if(locaId > -1) {
        cart[locaId].qtd += modalQtd; 
    } else {
        cart.push({
            identifier,
            id:modelsJson[key].id,
            size,
            qtd:modalQtd
        });
    }
    updateCart();
    closeModal();
});

c('.menu-open').addEventListener('click', ()=> {
    if(cart.length > 0) {
        c('aside').style.left = 0;
    }
});

c('.menu-closer').addEventListener('click', ()=> {
    c('aside').style.left = '100vw';
});

c('.cart-finish').addEventListener('click', ()=> {
    cart = [];
    updateCart();
})

function updateCart () {
    c('.menu-open span').innerHTML = cart.length;
    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart'). innerHTML = '';
        let subTotal = 0;
        let desconto = 0;
        let total = 0;
        cart.map((itemCart, index) => {
            let modelItem = modelsJson.find((itemBD) => itemBD.id == itemCart.id);
            subTotal += modelItem.price[itemCart.size] * itemCart.qtd;
            let cartItem = c('.models .cart-item').cloneNode(true);
            let modelSizeName;
            switch(itemCart.size) {
                case 0:
                    modelSizeName = 'P';
                    break;
                case 1:
                    modelSizeName = 'M'
                    break;
                case 2:
                    modelSizeName = 'G'
                    break;
            }
            cartItem.querySelector('img').src = modelItem.img;
            cartItem.querySelector('.cart-item-name').innerHTML = `${modelItem.name} (${modelSizeName})`;
            cartItem.querySelector('.cart-item-qtd').innerHTML = itemCart.qtd;
            cartItem.querySelector('.cart-item-qtdMenos').addEventListener('click', ()=> {
                if(itemCart.qtd > 1) {
                    itemCart.qtd--;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart-item-qtdMais').addEventListener('click', ()=> {
                itemCart.qtd++;
                updateCart();
            });
            c('.cart').append(cartItem)
        });
        desconto = subTotal * 0.1;
        total = subTotal - desconto;
        c('.subTotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
};