import { connectToMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/models/UserModel";

export const POST = async (request: Request) => {
   try {
      const { name, email, password } = await request.json();

      // Check if all fields are filled
      if (!name || !email || !password) {
         return NextResponse.json({ message: "Please fill in all fields." }, { status: 400 });
      }

      await connectToMongoDB();

      // Check if user already exists
      const userAlreadyExists = await User.findOne({ email });
      if (userAlreadyExists) {
         return NextResponse.json({ message: "User already exists." }, { status: 409 });
      }

      const hashedPassword = await bcrypt.hash(password, 5);

      // Create new user
      const newUser = await User.create({
         name: name,
         email: email,
         password: hashedPassword
      });

      return NextResponse.json(
         { message: "User registered." },
         { status: 201 }
      );
   } catch (error) {
      console.log(error);
      return NextResponse.json(
         { message: "Email Already In Use" },
         { status: 500 }
      );
   }
};
