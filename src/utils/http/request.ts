import axios from 'axios'

export class Request {
  constructor (private requester = axios) {
    this.requester = requester
  }
}
