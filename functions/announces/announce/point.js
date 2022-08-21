/**
 * builds a Point Maker
 * @exports buildMakePoint 
 * @returns {function}  - Point Maker
 */
 module.exports =  function buildMakePoint ({ 
}) {
  return function makePoint ({
    Lon,
    Lat,
  } = {}) {
    if (!Lon || isNaN(Lon)) {
    throw new Error('Point must have a valid Lon.')
    }
    if (!Lat || isNaN(Lat)) {
    throw new Error('Point must have a valid Lat.')
    }
    return Object.freeze({
        getLon: () => Lon,
        getLat: () => Lat,
    })
       
  }

}
