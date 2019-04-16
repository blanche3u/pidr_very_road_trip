const Pool = require('pg').Pool
const pool = new Pool({
  user: 'blanche3u',
  host: 'localhost',
  database: 'vrt-poi',
  password: 'Aene1297',
  port: 5432,
})

pgPromiseOptions = {
    query: (e) => {
        console.log('QUERY: ', e.query);
        if (e.params) {
            console.log('PARAMS:', e.params);
        }
    }
}

const pgp = require('pg-promise')(pgPromiseOptions);
const cn = {
  user: 'blanche3u',
  host: 'localhost',
  database: 'vrt-poi',
  password: 'Aene1297',
  port: 5432,
}

const db = pgp(cn);


const getCoord = (request, response) => {
  var south = request.query.south;
    var north = request.query.north;
    var east = request.query.east;
    var west = request.query.west;

    console.log('Get Mouvement')

    var fonct = 'trouveTousLesPoints(' + west + ',' + north + ',' + east + ',' + south + ',' + 3 + ',' + 3 + ')';
    var polygon = 'POLYGON((' +west+' '+north+','+east+' '+north+','+east+' '+south+','+west+' '+south+','+west+' '+north+'))'

    db.any('SELECT po_priority, po_latitude, po_longitude, po_linkimg FROM public.poi ORDER BY po_id LIMIT 5')
      .then(function(data) {
        response.json(data);
      })
      .catch(function(error){
        throw error
      });
}

   
   const getCoordMouv = (request, response) => {

    var south = request.query.south;
    var north = request.query.north;
    var east = request.query.east;
    var west = request.query.west;
    var nbX = request.query.nbX;
    var nbY = request.query.nbY;

    console.log('Get Mouvement');
    console.log(nbX);
    console.log(nbY)

    var fonct = 'trouveTousLesPoints(' + west + ',' + north + ',' + east + ',' + south + ',' + nbY + ',' + nbX + ')';
    var polygon = 'POLYGON((' +west+' '+north+','+east+' '+north+','+east+' '+south+','+west+' '+south+','+west+' '+north+'))'

    db.any('SELECT * FROM ' + fonct + ';')
      .then(function(data) {
        response.json(data);
        db.any('DROP TABLE res;').catch(function(error){throw error});
        db.any('UPDATE public.poi SET po_priority = po_priority+10 WHERE St_Within(po_geom,ST_GeomFromText(\'' + polygon+ '\',4326));')
        .then(function() {
          db.any('UPDATE public.poi SET po_priority = (100*(po_priority - min))/(max-min) FROM (SELECT MAX(po_priority) as max, MIN(po_priority) as min FROM public.poi) as extremum WHERE extremum.min != 0 OR extremum.max != 100; ')
          .catch(function(error){throw error});
        })
        .catch(function(error){throw error});
      })
      .catch(function(error){
        throw error
      });

  }

  const getUpdateClick = (request, response) => {

    var lat = request.query.lat;
    var lng = request.query.lng;

    console.log(lat + ' ' + lng)

    console.log('UPDATE Click');

    db.any('UPDATE public.poi SET po_priority = po_priority+50 WHERE po_latitude = $1 and po_longitude = $2;', [lat, lng])
        .then(function() {
          db.any('UPDATE public.poi SET po_priority = (100*(po_priority - min))/(max-min) FROM (SELECT MAX(po_priority) as max, MIN(po_priority) as min FROM public.poi) as extremum WHERE extremum.min != 0 OR extremum.max != 100; ')
          .catch(function(error){throw error});
        })
        .catch(function(error){throw error});

   }

/*

const createUser = (request, response) => {
  const { name, email } = request.body

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${result.insertId}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}
*/

module.exports = {
  getCoord,
  getCoordMouv,
  getUpdateClick,
  //createUser,
  //updateUser,
  //deleteUser,
}