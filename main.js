let category = document.forma.category;
let priceStr = document.forma.priceStart;
let priceEnd = document.forma.priceEnd;
let main = document.querySelector('.main');
let korzinka = document.querySelector('.korzinka');

let products = []

// home

function renderAll() {
    main.classList.remove('d-none')
    korzinka.classList.add('d-none')

}

//get category
async function Getcategory() {

    let response = await fetch('http://myjson.dit.upm.es/api/bins/awi1')
        .then((responce) => responce.json())
        .then(res => {
            let select = document.querySelector('select')
            res.map(obj => {
                let option = document.createElement('option');
                option.value = obj.category
                option.innerText = obj.category

                select.appendChild(option)
            })

        })
        .catch(err => console.log(err))



}
Getcategory()

function renderCategory(val) {

    let newArr = arr.filter(obj => {
        return obj.category.includes(val.value)
    })

    render(newArr)
}



// Products

async function getProducts() {  

    let response = await fetch('https://myjson.dit.upm.es/api/bins/j8nl')
        .then(response => response.json())
        .then((res) => {
            render(res)
            res.map(obj => {
                products.push(obj)
            })
        })
        .catch(err => console.log('Request Failed', err))

}
getProducts()

function render(data) {

    let count = 0;
    let shopping = document.querySelector('.shopping_products');
    shopping.innerHTML = '';
    data.map(obj => {


        let card = document.createElement('div');
        card.classList.add('card-item');
        let foto = document.createElement('img');
        let name = document.createElement('h3');
        let price = document.createElement('p');
        let buyIt = document.createElement('button');
        buyIt.classList.add('btn', 'btn-primary');
        buyIt.setAttribute('onclick', `sendTo(${count})`)
        buyIt.innerText = 'Sotib olish';

        foto.src = obj.img_src;
        name.innerText = obj.name;
        price.innerText = obj.cost + '$';

        card.appendChild(foto);
        card.appendChild(name);
        card.appendChild(price);
        card.appendChild(buyIt);
        shopping.appendChild(card)


        count++;
    })
}
render(products)

function searchByName(val) {

    let searchProducts = products.filter(obj => {
        return obj.name.toLowerCase().includes(val.value.toLowerCase());
    });
    render(searchProducts)
}

function searchByCategory() {

    let selectProduct = products.filter(obj => {
        return obj.category.toLowerCase().includes(category.value.toLowerCase());
    })

    render(selectProduct)
}

function searchByPrice() {

    let newProducts = [];
    let price1 = Number(priceStr.value);
    let price2 = Number(priceEnd.value);

    startPrice = price1

    if (price2 == '') {
        price2 = 400
    }

    endPrice = price2

    products.map(obj => {
        let currentCost = Number(obj.cost);
        if (currentCost > price1 && currentCost < price2)
            newProducts.push(obj);
    })

    render(newProducts)

}

// <<-----korzinka----->>


let korzinkaProducts = []
let arr = []

function openKorzina() {


    main.classList.add('d-none')
    korzinka.classList.remove('d-none')

    let mess = document.createElement('h2');
    mess.classList.add('messKorzina')
    mess.innerText = 'Sizning savatchangiz bo`sh!';
    korzinka.appendChild(mess)

    if (korzinkaProducts.length != 0) {
        mess.classList.add('d-none')
    }


    renderKorzina(korzinkaProducts)
}

function sendTo(index) {

    let badge = document.querySelector('.badge');
    badge.innerText = korzinkaProducts.length

    arr.push(products[index]);

    korzinkaProducts = arr.filter((x, index) => {
        return arr.indexOf(x) === index
    })
   
    console.log(korzinkaProducts)

}


function incr(val) {
    korzinkaProducts.map((item, index) => {
        if (index === val) {
            count++
            let countText = document.querySelectorAll('.countText')
            let allSumm = document.querySelectorAll('.allSumm')
            countText[val].innerText = count
            allSumm[val].innerText = 'Umumiy summa: ' + korzinkaProducts[val].cost * count;
        }

    })
}

function decr(val) {
    let allSumm = document.querySelectorAll('.allSumm')
    let countText = document.querySelectorAll('.countText')
    if (count <= 1) {
        count = 1
    } else {
        count--
        countText[val].innerText = count;
        allSumm[val].innerText = 'Umumiy summa: ' + korzinkaProducts[val].cost * count;
    }
}






function renderKorzina(data) {

    let index = 0;

    korzinka.innerHTML = '';

    data.map(obj => {

        let card = document.createElement('div');
        card.classList.add('row')
        let buyedProduct = `
        
        <div class="buy_product d-flex justify-content-between py-5 px-5 my-3 mx-auto row">
        <img width="100%"height="130px" class="col-5" src=${obj.img_src} />
        <div class='counter row col-4 align-items-center mt-3'> 
          <button onclick='decr(${index})' class='col-3 btn btn-danger'>-</button>
          <h3 class='col-3 countText text-center'>${count}</h3>
          <button onclick='incr(${index})' class='col-3 btn btn-primary'>+</button>
          <div class='col-12 allSumm'>Umumiy summa: ${obj.cost}</div>
        </div>
        <div class="info col-3 mt-3">
            <p>Nomi: ${obj.name}</p>
            <p>Narxi: ${obj.cost} $</p>
        </div>
        <i onclick='deleter(${index})' class="bi bi-trash3-fill"></i>
     </div>
        `
        card.innerHTML = buyedProduct
        korzinka.appendChild(card)


        index++;
    })


}

function deleter(val) {
    korzinkaProducts.splice(val, 1)
    renderKorzina(korzinkaProducts);
}