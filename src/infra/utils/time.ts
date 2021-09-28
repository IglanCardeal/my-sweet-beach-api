import moment from 'moment'

export class TimeUtil {
  /**
   * Retorna a data atual somada em 1 dia
   */
  public static getUnixTimeForFutureDay (days: number): number {
    return moment()
      .add(days, 'days')
      .unix()
  }
}
