/**
 * Makes a Announces Data Access
 * @param {function} makeDb -DataBase Connection Maker
 * @param {function} makeAuth -Admin Connection Maker
 * @param {function} firebase -Firebase Connection
 * @param {function} jwt -JSON Web Token Module
 * @param {function} crypto -Crypting Module
 * @exports makeAnnouncesDb 
 * @returns {Object}  - Announces Data Access Frozen Object
 */
module.exports =  function makeAnnouncesDb ({ makeDb, makeAuth, firebase, jwt, crypto, keywordFilter}) {
  return Object.freeze({
    deleteById,
    findAll,
    findById,
    findByUserId,
    filters,
    insert,
    update,
    updateVisibility
  })
  async function deleteById ({ ...announceInfo}) {
    const db = makeDb()
    const auth = makeAuth()
    console.log(announceInfo)
    return getAnnounce(announceInfo).then((result) => {
      const docID=String(result.id)
      console.log(docID)
      return auth.verifyIdToken(result.token).then((resp) => {
        if("moderator" == resp.role) {
          return db.collection('announces').doc(docID)
                .delete()
                .then((respond) => { 
                  return respond
                }).catch((error) => {
                  throw (new Error(error))
                })
        } else {
            throw (new Error("Permission Denied: not a moderator."))
        }
      }).catch(function(error) {
          throw (new Error(error))
      })
    })
  }
  async function findAll () {
    const db = makeDb()
    const data = [];
    const result = await db.collection('announces').orderBy("date_cr","desc").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            data.push({
                id: doc.id,
                body: doc.data()
            });
        });
    })
    .catch(function(error) {
      throw (new Error(error))
    });
    return data;
  }
  async function findByUserId ({ userId }) {
    const db = makeDb()
    const data = [];
    const result = await db.collection('announces').where("userId","==",userId).orderBy("date_cr","desc").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            data.push({
                id: doc.id,
                body: doc.data()
            });
        });
    })
    .catch(function(error) {
      throw (new Error(error))
    });
    return data;
  }
  async function filters ({
    keywords = "", 
    date_cr = 0
  }) {
    const db = makeDb()
    const data = [];
    var kwd = true
    console.log("Keyword#####",keywords)
    const result = await db.collection('announces').orderBy("date_cr","desc").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(element) {
          const anc = element.data()
          if(keywords != "" ){
            const keys = keywords.split(" ")
            const filter = new keywordFilter()
            filter.init(keys)
            kwd = filter.hasKeyword(String(anc.titre))
            console.log("KWD",kwd)
          }
          if (kwd){
            console.log("Titre",anc.titre)
            data.push({
              id: element.id,
              body: anc
            })
          }
        });
    })
    .catch(function(error) {
      throw (new Error(error))
    });
    return data;

  }
  
  async function findById ({ Id: _id }) {
    const db = makeDb()
    const data = [];
    const docID=String(_id);
    console.log(_id);
    const result = await db.collection('announces').doc(docID).get().then(function(doc) {
      if (doc.exists) {
        console.log(doc.id, " => ", doc.data());
        data.push({
        id: doc.id,
        body: doc.data()
        });
      } else {
          throw (new Error("Announce does NOT exist."))
      }
      
    })
    .catch(function(error) {
      throw (new Error(error))
    });
    return data;
  }
  async function insert ({ ...announceInfo}) {
    const db = makeDb()
    const auth = makeAuth()
    console.log(announceInfo)
    return getAnnounce(announceInfo).then((result) => {
        return db.collection('announces').add({
          titre: result.body.titre,
          date_cr: result.body.date_cr,
          date_update: result.body.date_update,
          description: result.body.description,
          address: result.body.address,
          size: result.body.size,
          image: result.body.image,
          visib: result.body.visib,
          userId: result.body.userId,
          files: result.body.files,
          points: result.body.points
        }).then((respond) => { 
          return { 
            id: respond._path.segments[1],
            body: result.body 
          }
        }).catch(function(error) {
            throw (new Error(error))
        });
      }).catch(function(error) {
          throw (new Error(error))
      });
  }
  async function update ({ ...announceInfo}) {
    const db = makeDb()
    const auth = makeAuth()
    console.log(announceInfo)
    return getAnnounce(announceInfo).then((result) => {
      return auth.verifyIdToken(result.token).then((resp) => {
        const docID=String(result.id)
        const ref = db.collection('announces').doc(docID)
        return db.runTransaction(async (t) => {
          const doc = await t.get(ref);
          const files = result.body.files
          t.update(ref, {
            files: files,
            titre: result.body.titre,
            description: result.body.description,
            address: result.body.address,
            size: result.body.size,
            image: result.body.image,
            date_update :result.body.date_update,
            userId: result.body.userId,
            points : result.body.points
          });
          return {
            id: result.id, 
            body: {
              files: files,
              titre: result.body.titre,
              description: result.body.description,
              image: result.body.image,
              date_update :result.body.date_update
            }
          }
        }).then((resp) => {
          return resp
        }).catch(error => {
          throw new Error(error)
        })
      }).catch(function(error) {
          throw (new Error(error))
      })
    })
  }
  async function updateVisibility ({ ...announceInfo}) {
    const db = makeDb()
    const auth = makeAuth()
    console.log(announceInfo)
    return getAnnounce(announceInfo).then((result) => {
      const docID=String(result.id)
      console.log(docID)
      return auth.verifyIdToken(result.token).then((resp) => {
        return db.collection('announces').doc(docID).update({
          visib: result.body.visib,
          date_update :result.body.date_update
        }).catch((error) => {
            throw (new Error(error))
        })
      }).catch(function(error) {
          throw (new Error(error))
      })
    })
  }
}
function getAnnounce(announce) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve({ 
          id: announce.id,
          body: {
            titre: announce.titre,
            date_cr: announce.date_cr,
            date_update: announce.date_update,
            description: announce.description,
            address: announce.address,
            size: announce.size,
            image: announce.image,
            visib: announce.visib,
            userId: announce.userId,
            files: announce.files,
            points: announce.points
           },
          token: announce.token,
          });
          reject(new Error('Errr')); 
      }, 10);
  });
}

