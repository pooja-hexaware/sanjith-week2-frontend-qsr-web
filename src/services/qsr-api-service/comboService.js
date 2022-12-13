import axiosInstance from "../../axios";

class ComboService {
    endPath = "combo"

    getCombos() {
        return axiosInstance.get(`${this.endPath}`)
    }
    
}

export default new ComboService();