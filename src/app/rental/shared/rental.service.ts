import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rental } from './rental.model';

@Injectable()
export class RentalService {

    private rentals: Rental[] = [{
        id: "1",
        title: "Central apartment",
        city: "Newyork",
        street: "Lowes street no.3",
        category: "apartment",
        image: "http://via.placeholder.com/350x250",
        bedrooms: 2,
        description: "sea view",
        dailyRate: 30,
        shared: false,
        createdAt: "30:12:2018"
      }];
    
      public getRentalById(rentalId: string): Observable<Rental> {

        return new Observable<Rental>(
            (observer) => {
                setTimeout(() => {
                   const foundRental = this.rentals.find((rental) => {
                        return rental.id == rentalId;
                    });

                    observer.next(foundRental);

                }, 500);

                
            }
        );
      }

    public getRentals(): Observable<Rental[]> {
        return new Observable<Rental[]>(
            (observer) => {
                setTimeout(
                    () => {
                        observer.next(this.rentals);
                    }, 1000
                );
            }
        );
    }
}