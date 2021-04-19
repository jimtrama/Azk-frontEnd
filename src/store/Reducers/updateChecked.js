const updateChecked = (state=[],action)=>{
    if(action.type==="updateChecked"){
        state=action.payload;
        return state;
    }
    return state;
}
export default updateChecked ;