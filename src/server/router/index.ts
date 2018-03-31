import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';

// import schemas
import { actors } from '../database/schema/actors';

// import { schema } from '../graph/scaryCat';

class API {

  static routerInstance = new Router();

  static get router(): Router {
    
    /* GET api listing. */
    this.routerInstance.get('/', async (ctx) => {
      ctx.status = 200;
      ctx.body = {
        msg: "api works!"
      }
    });

    this.routerInstance.get('/actors', async (ctx) => {
      let metActors = await actors.find();
      ctx.body = metActors;
    });


    // this.routerInstance.get('/graphql', graphqlKoa({ schema: schema }));
    // this.routerInstance.get('/graphiql', graphiqlKoa({ endpointURL: '/api/graphql' }));
    
    // this.routerInstance.post('/graphql', bodyParser(), graphqlKoa({ schema: schema }));

    return this.routerInstance;

  }
}

export const api = API.router;