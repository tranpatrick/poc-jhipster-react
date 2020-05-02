package fr.ptran.halitran;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {

        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("fr.ptran.halitran");

        noClasses()
            .that()
                .resideInAnyPackage("fr.ptran.halitran.service..")
            .or()
                .resideInAnyPackage("fr.ptran.halitran.repository..")
            .should().dependOnClassesThat()
                .resideInAnyPackage("..fr.ptran.halitran.web..")
        .because("Services and repositories should not depend on web layer")
        .check(importedClasses);
    }
}
