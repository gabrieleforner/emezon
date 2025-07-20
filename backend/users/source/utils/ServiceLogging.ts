/**
 * @author Gabriele Forner <gabriele.forner@icloud.com>
 * @brief This class exposes a centralized way to log
 * in a fixed format.
 * (whose is [users-microservice] [LEVEL] [dd/mm/yyyy - hh:mm:ss] )
 * */

class ServiceLogging {
    private static getFormattedTimestamp(): String {
        const now = new Date();
        const pad = (num: number): string => num.toString().padStart(2, '0');
        const day = pad(now.getDate());
        const month = pad(now.getMonth() + 1); // Months are zero-based
        const year = now.getFullYear();

        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());
        const seconds = pad(now.getSeconds());

        return `[${day}/${month}/${year} - ${hours}:${minutes}:${seconds}]`;
    }
    public static logInfo(msg: String) { console.log(`[users-microservice] [INFO] ${this.getFormattedTimestamp()}\t${msg}`); }
    public static logWarn(msg: String) { console.warn(`[users-microservice] [WARN] ${this.getFormattedTimestamp()}\t${msg}`); }
    public static logError(msg: String) { console.error(`[users-microservice] [ERROR] ${this.getFormattedTimestamp()}\t${msg}`); }
}
export default ServiceLogging;