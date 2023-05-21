import { config } from 'dotenv';
config();
import App from './app';
import NftController from './resources/nft/nft.controller';


const app = new App([
    new NftController()
],Number(process.env.PORT));

app.listen();
