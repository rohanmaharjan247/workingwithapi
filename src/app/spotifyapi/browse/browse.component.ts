import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpotifyService } from '../services/spotify.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements OnInit, AfterContentChecked {
  private readonly toDestroy$: Subject<boolean> = new Subject<boolean>();

  country = '';
  newReleases = [];
  featuredPlaylists = [];

  seedArtists = '';
  seedGenres = '';
  seedTracks = '';
  first = true;
  recommendedTracks = [];
  constructor(
    private avRouter: ActivatedRoute,
    private _spotifyService: SpotifyService
  ) {
    this.avRouter.queryParams.subscribe((data: any) => {
      this.country = data.country;
    });
  }
  ngAfterContentChecked(): void {
    if (
      this.first &&
      this.seedArtists != '' &&
      this.seedGenres != '' &&
      this.seedTracks != ''
    ) {
      this.first = false;
      this.getRecommendations(
        this.seedArtists,
        this.seedGenres,
        this.seedTracks
      );
    }
  }

  ngOnInit(): void {
    this.getBrowseNewReleases();
    this.getBrowseFeaturedPlaylists();
    this.getUserTopArtist();
    this.getUserTopTracks();
  }

  getBrowseNewReleases() {
    this._spotifyService
      .browseNewRelease(this.country)
      .pipe(takeUntil(this.toDestroy$))
      .subscribe((data: any) => {
        this.newReleases = data.albums.items;
      });
  }

  getBrowseFeaturedPlaylists() {
    this._spotifyService
      .browseFeaturedPlaylists(this.country)
      .pipe(takeUntil(this.toDestroy$))
      .subscribe((data: any) => {
        this.featuredPlaylists = data.playlists.items;
      });
  }

  getUserTopArtist() {
    this._spotifyService
      .getUserTop('artists')
      .pipe(takeUntil(this.toDestroy$))
      .subscribe((data: any) => {
        this.seedArtists = data.items[0].id;
        this.seedGenres = data.items[0].genres[0];
        console.log(data);
        //  this.userTopArtist = data.items;
      });
  }

  getUserTopTracks() {
    this._spotifyService
      .getUserTop('tracks')
      .pipe(takeUntil(this.toDestroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.seedTracks = data.items[0].id;
      });
  }

  getRecommendations(seedArtists, seedGenres, seedTracks) {
    this._spotifyService
      .recommendation(seedArtists, seedGenres, seedTracks)
      .subscribe((data: any) => {
        console.log(data);
        this.recommendedTracks = data.tracks;
      });
  }

  getFeaturedArtists(artists) {
    let featuredArtists = artists.slice(1);
    let returnString = '';
    for (let i = 0; i < featuredArtists.length; i++) {
      if (i == 0) {
        returnString += `(Feat. ${featuredArtists[i].name}`;
      } else {
        returnString += ` & ${featuredArtists[i].name}`;
      }
    }
    if (returnString != '') returnString += ')';
    return returnString;
  }
}
