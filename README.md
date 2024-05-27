# JSCRIPT-330-Final-Project

# Week 8 UPDATE: 
I'm slightly behind where I planned to be at this point as I'm behind on assignments that are important to getting setup and making the project. I do have basic routes set up as well a mongo but currently there is no authentication and no finished routes. Once I'm caught up on assignments, I'll be able to more easily set up this project in time for the deadline.

1. One of my hobbies is sewing and with that, I follow patterns to guide me in my projects. I find these patterns of personal blogs or websites such as Etsy but I don't have a good way of keeping track of all of my patterns that I'm working on or plan to make in the future. Although Etsy does have a purchase history tab, that only contains purchased from Etsy patterns and not any ones found anywhere else on the internet as well as other purchases I've made are also mixed in with that history so it isn't as compact and efficient as I'd like.
   
2. This project is meant to solve this issue of not having a way of keeping track of my patterns.
   
3. This project will have create, read, and delete routes so users can post a pattern link, find it again, or delete it. The database would be set up with a link that is given by a user with a key generated to keep track of them all. Each user will also have a key given to their specific user so each entry only belongs to their account. The entries will be my own pattern links so an external data source is unecessary for this.

4. For lookups, users will be able to search for links based off of the link path EX: https://www.etsy.com/listing/1445277419/swan-shoulder-wrap-bolero-long-sleeved/ would be the link put in and if i search for bolero or swan, this would be a result that would appear. Authentication would be coming from users logging in to see and access their patterns. Authorization will be two groups, one that is users and the other group that is me, who gets the privilege of having an update route.

5. Week 7: Set up a database and start at least post routes.
   Week 8: Complete rest of the routes and implement authentication.
   Week 9: Complete authorization and search function.
   Week 10: Finish anything that was not previously finished, create a brief presentation and present.
