import axiosInstance from "../../axios";

class StorePageService {
    endPath = "store"

    getStores() {
        return axiosInstance.get(`${this.endPath}`)
    }
    
}

export default new StorePageService();