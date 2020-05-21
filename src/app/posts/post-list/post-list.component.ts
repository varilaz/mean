import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

import { Post } from '../post.model'
import { PostsService } from '../../post.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector:'app-post-list',
    templateUrl:'./post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

    // posts  = [ 
    //     { title: 'First post', content: 'first post\'s content' },
    //     { title: 'Second post', content: 'Second post\'s content' },
    //     { title: 'Third post', content: 'third post\'s content' },
    // ]

    //@Input() posts: Post[] = [];

    posts:Post [] = [];
    private postsSub : Subscription;
    isLoading = false;
    totalPosts = 0;
    postsPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1,2, 3, 10];
    userId: string;

    constructor (private postsService:PostsService, private authService: AuthService) {}

    userIsAutheticated = false;
    private authListenerSubs: Subscription; 

    ngOnInit(){
        this.isLoading = true;
        this.userId = this.authService.getUserId();
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.postsSub = this.postsService.getPostUpdateListener().subscribe((postData:{ posts: Post[], postCount:number}) => {
            this.isLoading = false;
            this.totalPosts = postData.postCount
            this.posts = postData.posts;
        });
        this.userIsAutheticated = this.authService.getIsAuth();
        this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAutheticated =>{
            this.userIsAutheticated = isAutheticated;
            this.userId = this.authService.getUserId();
        });
    }

    onDelete(postId:string){
        this.isLoading = true;
        this.postsService.deletePost(postId).subscribe(() => {
            this.postsService.getPosts(this.postsPerPage, this.currentPage);
        }, () => {
            this.isLoading = false;
        });
    }
    
    ngOnDestroy(){
        this.postsSub.unsubscribe();
        this.authListenerSubs.unsubscribe();
    }

    onChangePage(pageData: PageEvent){
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }

}