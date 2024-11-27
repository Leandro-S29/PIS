function trocar() {
    const coracao1 = "../images/Coracaocheio.svg";
    const coracao2 = "../images/Coracaovazio.svg"
    const icon = document.getElementById('svg-icon');
    if(icon.src == coracao2){
    icon.src = coracao1;
    }else(icon.src == coracao1) 
    {
        icon.src = coracao2; 
    }
}