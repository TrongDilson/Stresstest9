package rmitvn.SpringBootArchitecture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import rmitvn.SpringBootArchitecture.customer.Customer;
import rmitvn.SpringBootArchitecture.customer.CustomerRepository;

@SpringBootApplication
public class SpringBootArchitectureApplication implements CommandLineRunner {

	@Autowired
	private CustomerRepository repository;

	public static void main(String[] args) {
		SpringApplication.run(SpringBootArchitectureApplication.class, args);
	}
	
	@Override
	public void run(String... args) {
	
		//save a few customers
		repository.save(new Customer("Jack", "Bauer", "teacher"));
		repository.save(new Customer("Chloe", "O'Brian", "engineer"));
		repository.save(new Customer("Kim", "Bauer", "artist"));
		repository.save(new Customer("David", "Palmer", "engineer"));
		repository.save(new Customer("Michelle", "Dessler", "test examiner"));

		// fetch all customers
		System.out.println("Customers found with findAll():");
		System.out.println("-------------------------------");
		repository.findAll().forEach(customer -> {
			System.out.println(customer.toString());
		});
		System.out.println("");
	};
}
