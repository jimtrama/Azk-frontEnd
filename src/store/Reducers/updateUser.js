const updateUser = (state={},action)=>{
    if(action.type==="updateUser"){
        state=action.payload;
        return state;
    }
    return state;
}
export default updateUser ;