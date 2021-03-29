import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SpotifyService } from '../services/spotify.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss'],
})
export class CallbackComponent implements OnInit {
  code = '';
  state = '';
  constructor(
    private _spotifyService: SpotifyService,
    private router: Router,
    private avRouter: ActivatedRoute
  ) {
    this.avRouter.queryParams.subscribe((params)=>{
      this.code = params.code;
      this.state = params.state;
    })
  }

  ngOnInit(): void {
    this.callback();
  }

  callback() {
    this._spotifyService.callback(this.code, this.state).subscribe((data: any) => {
      if (data.result) {
        localStorage.setItem('access_token', data.message);
        this.router.navigate(['/spotify/profile'], {
          queryParams: { isAuthorized: data.result },
        });
      }
    });
  }
}
