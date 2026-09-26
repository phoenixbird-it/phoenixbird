from django.core.management.base import BaseCommand

from companies.models import CompanySettings
from industries.models import Industry
from locations.models import Location
from services.models import Service, ServiceCategory


SERVICES = [
    (ServiceCategory.HOSPITALITY, 'Hotel Housekeeping Staff', 'Trained housekeeping manpower for hotels and resorts.'),
    (ServiceCategory.HOSPITALITY, 'Room Attendants', 'Dedicated room attendants for daily guest room upkeep.'),
    (ServiceCategory.HOSPITALITY, 'Public Area Cleaning Staff', 'Manpower for lobby, corridor and public area upkeep.'),
    (ServiceCategory.HOSPITALITY, 'Kitchen Helpers', 'Support staff for hotel kitchen operations.'),
    (ServiceCategory.HOSPITALITY, 'Stewarding Staff', 'Stewarding manpower for banquet and F&B operations.'),
    (ServiceCategory.HOSPITALITY, 'General Hospitality Manpower', 'Flexible manpower support across hospitality operations.'),

    (ServiceCategory.HOSPITAL, 'Hospital Housekeeping Staff', 'Non-clinical housekeeping support for hospitals.'),
    (ServiceCategory.HOSPITAL, 'Ward Support Staff', 'Support manpower for ward-level non-clinical tasks.'),
    (ServiceCategory.HOSPITAL, 'Kitchen Helpers', 'Kitchen and pantry support staff for hospital food services.'),
    (ServiceCategory.HOSPITAL, 'Facility Support Staff', 'General facility support manpower for hospital premises.'),

    (ServiceCategory.INDUSTRIAL, 'Industrial Helpers', 'General helpers for industrial and factory operations.'),
    (ServiceCategory.INDUSTRIAL, 'Production Helpers', 'Manpower support for production line operations.'),
    (ServiceCategory.INDUSTRIAL, 'Semi-Skilled Workers', 'Semi-skilled manpower for manufacturing tasks.'),
    (ServiceCategory.INDUSTRIAL, 'Packaging Helpers', 'Support staff for packaging and dispatch operations.'),
    (ServiceCategory.INDUSTRIAL, 'Material Handling Support', 'Manpower for material movement and handling.'),

    (ServiceCategory.FACILITY_MANAGEMENT, 'Housekeeping Services', 'Comprehensive housekeeping manpower for facilities.'),
    (ServiceCategory.FACILITY_MANAGEMENT, 'Office Cleaning', 'Daily office cleaning manpower support.'),
    (ServiceCategory.FACILITY_MANAGEMENT, 'Deep Cleaning Support', 'Manpower support for periodic deep cleaning.'),

    (ServiceCategory.CLEANING, 'Commercial Cleaning', 'Cleaning manpower for commercial establishments.'),
    (ServiceCategory.CLEANING, 'Toilet / Washroom Cleaning', 'Dedicated washroom cleaning manpower.'),
    (ServiceCategory.CLEANING, 'Cafeteria Cleaning', 'Cleaning support for cafeteria and dining areas.'),

    (ServiceCategory.GARDEN_LANDSCAPE, 'Garden Maintenance', 'Manpower for garden upkeep and maintenance.'),
    (ServiceCategory.GARDEN_LANDSCAPE, 'Landscape Maintenance', 'Landscape maintenance manpower for large properties.'),

    (ServiceCategory.CORPORATE, 'Office Support Staff', 'General office support manpower for corporate offices.'),
    (ServiceCategory.CORPORATE, 'Corporate Housekeeping', 'Housekeeping manpower for corporate premises.'),

    (ServiceCategory.COMMERCIAL, 'Commercial Establishment Manpower', 'General manpower support for commercial establishments.'),
]

INDUSTRIES = [
    ('Hotels & Hospitality', 'Hotels, resorts, residencies and hospitality establishments.'),
    ('Hospitals & Healthcare', 'Hospitals and healthcare facilities requiring non-clinical support manpower.'),
    ('Industrial & Manufacturing', 'Factories, manufacturing units and industrial companies.'),
    ('Corporate Offices', 'Corporate offices and business establishments.'),
    ('Commercial Establishments', 'Malls, commercial buildings and other business facilities.'),
    ('Residential & Hospitality Properties', 'Residencies, serviced apartments and similar properties.'),
]

LOCATIONS = [
    ('Madurai', True),
    ('Chennai', False),
    ('Coimbatore', False),
    ('Trichy', False),
    ('Tirunelveli', False),
    ('Salem', False),
]


class Command(BaseCommand):
    help = 'Seed initial services, industries, locations and company settings.'

    def handle(self, *args, **options):
        CompanySettings.load()

        for order, (category, title, short_desc) in enumerate(SERVICES):
            Service.objects.get_or_create(
                title=title,
                defaults={
                    'category': category,
                    'short_description': short_desc,
                    'long_description': short_desc,
                    'display_order': order,
                },
            )

        for order, (name, desc) in enumerate(INDUSTRIES):
            Industry.objects.get_or_create(
                name=name,
                defaults={'short_description': desc, 'description': desc, 'display_order': order},
            )

        for order, (name, is_primary) in enumerate(LOCATIONS):
            Location.objects.get_or_create(
                name=name,
                defaults={'is_primary': is_primary, 'display_order': order},
            )

        self.stdout.write(self.style.SUCCESS('Seed data created successfully.'))
