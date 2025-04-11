import { Entity,Column,  } from "typeorm";

@Entity()
class User{
    @Column()
    id:Number
    @Column()
    username: string
    @Column


}
