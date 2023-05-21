import express, { Application } from "express";
import cors from 'cors'
import morgan from "morgan";
import helmet from 'helmet'
import Controller from "utils/interfaces/controller.interface";
import ErrorMiddleware from "./middlewares/error.middleware";
import { rateLimiterMiddleware } from "./middlewares/rate-limiter.middleware";


class App {
    public app: Application;
    public port: number;
    
    constructor(controllers:Controller[], port:number){
        this.app = express();
        this.port = port;
        
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initialeseErrorHandling();
    }

    private initializeMiddlewares(){
        this.app.use(rateLimiterMiddleware)
        this.app.use(express.json());
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded(
            {extended:false}
        ));
    }

    private initializeControllers(controllers:Controller[]){
        controllers.forEach((controller)=>{
            this.app.use('/',controller.router);
        })
    }
    private initialeseErrorHandling():void {
        this.app.use(ErrorMiddleware);
    }

    public listen(){
        this.app.listen(this.port,()=>{
            console.log(`App listening on the port ${this.port}`);
        })
    }
}

export default App;
