// Dom selection
(()=>{
  const filterInputElm = document.querySelector('#filter')
  const msgElm = document.querySelector('.msg')
  const nameInputElm = document.querySelector('.nameInput')
  const priceInputElm = document.querySelector('.priceInput')
  const formElm = document.querySelector('form')
  const submitElm = document.querySelector('.submit-btn')
  const collectionElm = document.querySelector('.collection')
  const submitBtnElm = document.querySelector('.submit-btn button')
  
  
  
  let products = localStorage.getItem('storageItem') ? JSON.parse(localStorage.getItem('storageItem')) : []
  
  // getting input
  function getinputs(){
      const name = nameInputElm.value
      const price = priceInputElm.value
  
      return {name, price}
  }
  // input validation part
  function validationIputs(name,price){
    let isInValid = false
    if(name === '' || price === ''){
      isInValid = true
      showMessage('Please provides valid Inputs','danger')
    }
  
    if(Number(price) !== Number(price)){
      isInValid = true
      showMessage('Please provide price as number','danger')
    }
  
    if(price <= 0){
      isInValid = true
      showMessage('Please provides valid Inputs','danger')
    }
    return isInValid
  }
  
  function clearMsg(){
    msgElm.textContent = ''
  }
  //  message part
  function showMessage(msg, action = 'success'){
    const textMsg = `<div class="alert alert-${action}" role="alert">
    ${msg}
  </div>`
  msgElm.insertAdjacentHTML('afterbegin',textMsg)
  setTimeout(() => {
    clearMsg()
  }, 2000);
  
  }
  
  // reset input's
  function  resetInputs(){
    nameInputElm.value = ''
    priceInputElm.value = ''
  }
  // adding product to memory storage
  function addProduct(name,price){
    const product = {
      id: products.length+1,
      name,
      price,
    }
    products.push(product)
    return product
  }
  
  // show product item to UI
  function showUiProduct(productInfo){
    const noFoundData = document.querySelector('.not-found-data')
    if(noFoundData){
      noFoundData.remove()
  
    }
    const {id, name, price}= productInfo
  
  const elm = `<li class="list-group-item collection-item d-flex flex-row justify-content-between" data-productId = "${id}">
  <div class="product-info">
    <strong>${name}-</strong> <span class="price">$${price}</span>
  </div>
  <div class="action-btn">
  <i class="fa fa-pencil-alt edit-product  me-2"></i>
  <i class="fa fa-trash-alt delete-product"></i>
  </div>
  </li>`;
  
  collectionElm.insertAdjacentHTML("afterbegin",elm)
  showMessage('Product added Successfully')
  }
  
  // adding product item to local sotrage
  function addProductStorage(product){
  let products
  if(localStorage.getItem('storageItem')){
    products = JSON.parse(localStorage.getItem('storageItem'))
    products.push(product)
  
  }else{
    products = []
    products.push(product)
   
   
  }
  localStorage.setItem('storageItem', JSON.stringify(products))
    
  }
  
  // product edit and update part
  function updatedProducts(receiveProduct){
    
   const updatedProduct =  products.map((product)=>{
  
      if(product.id === receiveProduct.id){
       
        return {
          ...product,
          name: receiveProduct.name,
          price: receiveProduct.price
        }
      }else{
        return product
      }
    })
   
    return updatedProduct
    
  }
  
  function clearUpdatePart(){
    submitBtnElm.textContent = 'Submit'
    submitBtnElm.classList.remove('btn-dark')
    submitBtnElm.classList.remove('update-product')
    submitBtnElm.removeAttribute('data-id')
  }
  
  // updated product add to local storage
  function updateProductToStorae(product){
  
    localStorage.setItem('storageItem', JSON.stringify(products))
    showMessage('Product updated Successfully')
   
  }
  
  // form submit part
  function handleSubmitform(evt){
      evt.preventDefault()
  
    const {name, price} =   getinputs()
  
   const isInValid =  validationIputs(name,price)
   if(isInValid) return
  
   resetInputs()
  
  if(submitBtnElm.classList.contains('update-product')){
  
    const id = Number(submitBtnElm.dataset.id)
  
    const product = {
      id,
      name,
      price
    }
   const updatedProduct = updatedProducts(product)
   console.log(updatedProduct)
   products = updatedProduct
  
   showAllItemToUI(products)
  
   updateProductToStorae(product)
  
   clearUpdatePart()
  
   return
    
  }else{
    const product = addProduct(name,price)
  
    // add product to localStorage
    addProductStorage(product)
    
  // show product UI
   showUiProduct(product)
  }
  }
  
  // Show item to UI after add porduct to loca storage
  function showAllItemToUI(products){
    collectionElm.textContent = ''
    let liElms
    liElms = products.length ===0 ? '<li class ="list-group-item  collection-item not-found-data"> No product show </li>' : ''
  
    products.sort((a,b)=> b.id-a.id)
    products.forEach(product => {
      const{id,name,price} = product
      liElms += `<li class="list-group-item collection-item d-flex flex-row justify-content-between" data-productId = "${id}">
      <div class="product-info">
        <strong>${name}-</strong> <span class="price">$${price}</span>
      </div>
      <div class="action-btn">
      <i class="fa fa-pencil-alt edit-product  me-2"></i>
      <i class="fa fa-trash-alt delete-product"></i>
      </div>
      </li>`;
  
    });
    collectionElm.insertAdjacentHTML('afterbegin', liElms)
  }
  
  // find id to Item Delete from UI
  function getProductId(evt){
    const liElm = evt.target.parentElement.parentElement
    const id = Number(liElm.getAttribute('data-productId'))
    return id
   
  }
  
  // other's product id filter from remove id/item
  function removeItem(id){
    products = products.filter((product)=>product.id!==id)
  }
  
  // remove item from memory UI sotrage
  function removeItemFromUI(id){
    document.querySelector(`[data-productId = "${id}"]`).remove()
    showMessage('Product Delete successfully','warning')
     
  }
  
   // remove item from local storage
  function removeItemFromStorage(id){
    let products
    products = JSON.parse(localStorage.getItem('storageItem'))
    products = products.filter((product) =>product.id !== id)
  
    localStorage.setItem('storageItem', JSON.stringify(products)) 
  }
  
  // find id for edit / update product item
  function findProduct(id){
  const findProductId =   products.find((product)=>product.id === id)
  return findProductId
  }
  
  // populate function for reassign values in owns field
  function populateProduct(product){
     nameInputElm.value = product.name
     priceInputElm.value  = product.price
  
     // change button field
     submitBtnElm.textContent = 'Update-Product'
     submitBtnElm.classList.add('btn-dark')
     submitBtnElm.classList.add('update-product')
     submitBtnElm.setAttribute('data-id', product.id)
  }
  
  // delete item part
  function handleManupuligProduct(evt){
  
     //find product id for delete item
    let id = getProductId(evt)
  
    if(evt.target.classList.contains('delete-product')){
     
      //filtering remove item
      removeItem(id)
      // remove item from storage
      removeItemFromStorage(id)
      // removing item from UI
      removeItemFromUI(id)
      // product eidit part
    } else if(evt.target.classList.contains('edit-product')){
  
     const foundProduct = findProduct(id)
      // reassign values to input field
      populateProduct(foundProduct)
    }
  }
  
  // search filter part
  function handleFilter(evt){
    const text = evt.target.value
    const filterProduct = products.filter(product => product.name.includes(text))
  
  showAllItemToUI(filterProduct)
   
  }
  
  
  function init(){
  // form submit part
    formElm.addEventListener('submit', handleSubmitform)
    // show all product to UI
    document.addEventListener('DOMContentLoaded', (evt)=>{
      showAllItemToUI(products)
    })
  // delete/edit item event part
  collectionElm.addEventListener('click', handleManupuligProduct)
  // product filtering
  filterInputElm.addEventListener('keyup', handleFilter)
  }
  
  init()

})()
