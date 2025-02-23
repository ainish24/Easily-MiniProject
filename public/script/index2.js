document.getElementById("apply-now-button").addEventListener("click",()=>{
    document.getElementsByClassName("applyNowForm")[0].style.display="flex"
    console.log("clicked")
})
function closeApplyNow(){
    document.getElementsByClassName("applyNowForm")[0].style.display="none"
}
document.getElementById("apply-close").addEventListener("click",closeApplyNow)
document.getElementById("closeButton").addEventListener("click",closeApplyNow)