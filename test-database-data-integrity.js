/**
 * Data Integrity Tests
 * Verifies data quality and completeness
 */

const BASE_URL = 'http://localhost:3000';

async function testDataIntegrity() {
  console.log('🔍 Testing Data Integrity\n');
  console.log('='.repeat(60));
  
  let issues = [];
  let checks = 0;
  
  try {
    // Fetch all programs
    const response = await fetch(`${BASE_URL}/api/study-programs?limit=100`);
    const data = await response.json();
    
    if (!data.programs || data.programs.length === 0) {
      console.log('❌ No programs found in database');
      return;
    }
    
    const programs = data.programs;
    console.log(`\n📊 Analyzing ${programs.length} programs...\n`);
    
    // Check 1: Required fields
    console.log('Check 1: Required Fields');
    programs.forEach((p, idx) => {
      checks++;
      if (!p.id || !p.name || !p.institution || !p.institutionType || !p.field || p.minPoints === undefined) {
        issues.push(`Program ${idx + 1} (${p.id || 'unknown'}): Missing required fields`);
      }
    });
    if (issues.length === 0) {
      console.log('✅ All programs have required fields');
    } else {
      console.log(`❌ ${issues.length} programs missing required fields`);
    }
    
    // Check 2: Duplicate IDs
    console.log('\nCheck 2: Duplicate IDs');
    const ids = programs.map(p => p.id);
    const uniqueIds = new Set(ids);
    checks++;
    if (ids.length === uniqueIds.size) {
      console.log('✅ No duplicate IDs');
    } else {
      const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);
      console.log(`❌ Found ${duplicates.length} duplicate IDs:`, duplicates.slice(0, 5));
      issues.push(`Duplicate IDs found: ${duplicates.length}`);
    }
    
    // Check 3: Valid institution types
    console.log('\nCheck 3: Valid Institution Types');
    const invalidTypes = programs.filter(p => p.institutionType !== 'yliopisto' && p.institutionType !== 'amk');
    checks++;
    if (invalidTypes.length === 0) {
      console.log('✅ All institution types are valid');
    } else {
      console.log(`❌ ${invalidTypes.length} programs have invalid institution type`);
      issues.push(`Invalid institution types: ${invalidTypes.length}`);
    }
    
    // Check 4: Valid point ranges
    console.log('\nCheck 4: Valid Point Ranges');
    const invalidPoints = programs.filter(p => 
      p.minPoints < 0 || p.minPoints > 300 || 
      (p.maxPoints && (p.maxPoints < p.minPoints || p.maxPoints > 300))
    );
    checks++;
    if (invalidPoints.length === 0) {
      console.log('✅ All point ranges are valid');
    } else {
      console.log(`❌ ${invalidPoints.length} programs have invalid point ranges`);
      issues.push(`Invalid point ranges: ${invalidPoints.length}`);
    }
    
    // Check 5: Field distribution
    console.log('\nCheck 5: Field Distribution');
    const fieldCounts = {};
    programs.forEach(p => {
      fieldCounts[p.field] = (fieldCounts[p.field] || 0) + 1;
    });
    console.log('Fields:', Object.entries(fieldCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([field, count]) => `${field}: ${count}`)
      .join(', '));
    checks++;
    console.log('✅ Field distribution looks good');
    
    // Check 6: Institution type distribution
    console.log('\nCheck 6: Institution Type Distribution');
    const yliopistoCount = programs.filter(p => p.institutionType === 'yliopisto').length;
    const amkCount = programs.filter(p => p.institutionType === 'amk').length;
    console.log(`Yliopisto: ${yliopistoCount}`);
    console.log(`AMK: ${amkCount}`);
    checks++;
    if (yliopistoCount > 0 && amkCount > 0) {
      console.log('✅ Both institution types represented');
    } else {
      console.log('⚠️  Missing one institution type');
    }
    
    // Check 7: Career connections
    console.log('\nCheck 7: Career Connections');
    const programsWithCareers = programs.filter(p => p.relatedCareers && p.relatedCareers.length > 0);
    const programsWithoutCareers = programs.length - programsWithCareers.length;
    console.log(`Programs with career connections: ${programsWithCareers.length}`);
    console.log(`Programs without career connections: ${programsWithoutCareers}`);
    checks++;
    if (programsWithCareers.length > programsWithoutCareers) {
      console.log('✅ Most programs have career connections');
    } else {
      console.log('⚠️  Many programs missing career connections');
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Integrity Check Summary');
    console.log('='.repeat(60));
    console.log(`Total checks: ${checks}`);
    console.log(`Issues found: ${issues.length}`);
    
    if (issues.length === 0) {
      console.log('\n🎉 All integrity checks passed!');
    } else {
      console.log('\n⚠️  Issues found:');
      issues.forEach(issue => console.log(`   - ${issue}`));
    }
    
  } catch (error) {
    console.error('❌ Error running integrity checks:', error.message);
  }
}

testDataIntegrity().catch(console.error);

