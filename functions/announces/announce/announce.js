/**
 * builds a Announce Maker
 * @exports buildMakeAnnounce 
 * @returns {function}  - Announce Maker
 */
module.exports =  function buildMakeAnnounce ({ 
  makePoint
}) {
  return function makeAnnounce ({
    id = "",
    titre,
    date_cr = Date.now(),
    date_update = Date.now(),
    description,
    address,
    size,
    image = "",
    token,
    userId,
    visib = false,
    files = [],
    points = [],
    action
  } = {}) {
    if(!action){
      throw new Error('Announce Action required.')        
    }
    else {
      switch(action){
        case "postAnnounce" : {
          if (!titre) {
            throw new Error('Announce must have a titre.')
          }
          if (titre.length < 3) {
            throw new Error("Announce's titre  must be longer than 2 characters.")
          }
          if (!description) {
            throw new Error('Announce must have a description.')
          }
          if (description.length < 3) {
            throw new Error("Announce's description must be longer than 2 characters.")
          }
          if (!image) {
            throw new Error('Announce must have Image.')
          }
          if (!address) {
            throw new Error('Announce must have an address.')
          }
          if (address.length < 3) {
            throw new Error("Announce's address must be longer than 2 characters.")
          }
          if (!size) {
            throw new Error('Announce must have a size.')
          }
          if (size.length < 1) {
            throw new Error("Announce's size titre must be longer than 0 characters.")
          }
          if (!userId) {
            throw new Error('Announce must have a userId.')
          }
          const validFiles = []
          for(let i = 0; i < files.length; i++ ){
            if(!files[i] || files[i].length < 3){
              throw new Error("invalid file Url.")
            } else {
              validFiles.push(files[i])
            }
          }
          const validPoints = []  
          for(let i = 0; i < points.length; i++ ){
            let point = makePoint(points[i])
            validPoints.push({
              Lon : point.getLon(),
              Lat : point.getLat()
            })
          }    
          return Object.freeze({
            getId: () => id,
            getTitre: () => titre,
            getDate_cr: () => date_cr,
            getDate_update: () => date_update,
            getDescription: () => description,
            getAddress: ()=> address,
            getSize: () => size,
            getUserId: () => userId,
            getVisib: () => visib,
            getImage: () => image,
            getFiles: () => validFiles,
            getPoints: () => validPoints
          })
        }
      
        case "putAnnounce": {
          if (!id) {
            throw new Error('Announce must have an Id.')
          }
          if (!titre) {
            throw new Error('Announce must have a titre.')
          }
          if (titre.length < 3) {
            throw new Error("Announce's titre  must be longer than 2 characters.")
          }
          if (!description) {
            throw new Error('Announce must have a description.')
          }
          if (description.length < 3) {
            throw new Error("Announce's description titre must be longer than 2 characters.")
          }
          if (!image) {
            throw new Error('Announce must have Image.')
          }
          if (!address) {
            throw new Error('Announce must have an address.')
          }
          if (address.length < 3) {
            throw new Error("Announce's address must be longer than 2 characters.")
          }
          if (!size) {
            throw new Error('Announce must have a size.')
          }
          if (size.length < 1) {
            throw new Error("Announce's size titre must be longer than 0 characters.")
          }
          if (!token || token.length < 50) {
            throw new Error('Announce must have a Valid Token.')
          }
          if (!userId) {
            throw new Error('Announce must have a userId.')
          }
          const validFiles = []
          for(let i = 0; i < files.length; i++ ){
            if(!files[i] || files[i].length < 3){
              throw new Error("invalid file Url.")
            } else {
              validFiles.push(files[i])
            }
          } 
          const validPoints = []  
          for(let i = 0; i < points.length; i++ ){
            let point = makePoint(points[i])
            validPoints.push({
              Lon : point.getLon(),
              Lat : point.getLat()
            })
          }     
          return Object.freeze({
            getId: () => id,
            getTitre: () => titre,
            getDate_update: () => date_update,
            getDescription: () => description,
            getAddress: ()=> address,
            getSize: () => size,
            getImage: () => image,
            getToken: () => token,
            getFiles: () => validFiles,
            getPoints: () => validPoints,
            getUserId: () => userId
          })
        }

        case "putVisibAnnounce": {
          if (!id) {
            throw new Error('Announce must have an Id.')
          }
          
          if (!token) {
            throw new Error('Announce must have a Token.')
          }
          
          return Object.freeze({
            getId: () => id,
            getToken: () => token,
            getDate_update: () => date_update,
            getVisib: () => visib
          })
        }
        case "deleteAnnounce": {
          if (!id) {
            throw new Error('Announce must have an Id.')
          }
          
          if (!token) {
            throw new Error('Announce must have a Token.')
          }
          
          return Object.freeze({
            getId: () => id,
            getToken: () => token,
          })
        }
    
        default: {
          throw new Error("Invalid Action.");
        }
      }
    }
  }

}
