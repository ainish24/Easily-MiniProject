document.getElementById("register-button").addEventListener("click",()=>{
    document.getElementById("popup-form").style.display="flex"
})

document.getElementById("register-close").addEventListener("click",()=>{
    document.getElementById("popup-form").style.display="none"
})

document.getElementById("register-login-button").addEventListener("click",()=>{
    document.getElementById("popup-form").style.display="none"
    document.getElementById("popup-login-form").style.display="flex"
})

document.getElementById("login-close").addEventListener("click",()=>{
    document.getElementById("popup-login-form").style.display="none"
})
