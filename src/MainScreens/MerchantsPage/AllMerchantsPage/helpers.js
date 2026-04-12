export const getHeaderBtnString = (isHotel) => {
   const btns = ['back'];

   if(!isHotel){
     btns.push('filter');
   }

   return btns
}