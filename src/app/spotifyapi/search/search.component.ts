import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchText = new FormControl();

  searchedAlbums = [];
  searchedArtists = [];
  searchedPlaylists = [];
  searchedTracks = [];

  constructor(private avRouter: ActivatedRoute, private _spotifyService: SpotifyService) {
    this.avRouter.queryParams.subscribe((data:any)=>{
      console.log(data);
      this.searchText.value(data.q);
    })
   }

  ngOnInit(): void {
  }

  search() {
    if (this.searchText.value != '' && this.searchText.value != null) {
      this._spotifyService
        .search(this.searchText.value)
        .subscribe((data: any) => {
          console.log(data);
          this.searchedAlbums = data.albums.items;
          this.searchedArtists = data.artists.items;
          this.searchedPlaylists = data.playlists.items;
          this.searchedTracks = data.tracks.items;
        });
    } else {
      alert('Search text required');
    }
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
