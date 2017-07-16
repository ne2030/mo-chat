export const enterSubmit = function(e){
    console.log(this);
    if(e && e.keyCode === 13) {
        this.handleSubmit();
    }
}
