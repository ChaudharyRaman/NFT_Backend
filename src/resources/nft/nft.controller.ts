import { Router, Request, Response, NextFunction } from "express";
import Controller from "utils/interfaces/controller.interface";
import NftService from "./nft.service";
import authMiddleware from "../../middlewares/auth.middleware";
import HttpException from "../../utils/exceptions/http.exception";

class NftController implements Controller {
    public path = '/nfts';
    public router = Router();

    private NftService  = new NftService();

    constructor(){
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.post(
            `${this.path}/login`,
            this.login
        );
        this.router.get(
            `${this.path}`,
            authMiddleware,
            this.getAllNfts
        )
        this.router.get(
            `${this.path}/:id`,
            authMiddleware,
            this.getNftById
        )
        this.router.post(
            `${this.path}`,
            authMiddleware,
            this.createNft
        )
        this.router.put(
            `${this.path}/:id`,
            authMiddleware,
            this.updateNft
        )
        this.router.delete(
            `${this.path}/:id`,
            authMiddleware,
            this.deleteNft
        )
    }
    private login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id, password } = req.body;
            const token = await this.NftService.login(id, password);
            res.status(200).json({ token });
        } catch (error:any) {
            next(new HttpException(400, error.message));
        }
    }
    private getAllNfts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const nfts = await this.NftService.getAllNfts();
            res.status(200).json({ nfts });
        } catch (error:any) {
            next(new HttpException(400, error.message));
        }
    }
    private getNftById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const nft = await this.NftService.getNftById(id);
            res.status(200).json({ nft });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }
    private createNft = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { tokenURI } = req.body;
            const hash = await this.NftService.createNft(tokenURI);
            res.status(200).json({ Transaction_Hash:hash });
        } catch (error:any) {
            next(new HttpException(400,error.message));
        }
    }
    private updateNft = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { tokenURI } = req.body;
            const nft = await this.NftService.updateNft(Number(id), tokenURI);
            res.status(200).json({ "status": "NFT Updated Successfully!", "Transaction_Hash":nft });
        } catch (error:any) {
            next(new HttpException(404, error.message));
        }
    }
    private deleteNft = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const nft = await this.NftService.deleteNft(Number(id));
            res.status(200).json({ "status": "NFT Deleted Successfully!", "Transaction_Hash":nft });
        } catch (error:any) {
            next(new HttpException(404, error.message));
        }
    }
}


export default NftController;