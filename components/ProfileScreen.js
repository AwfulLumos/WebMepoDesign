/* eslint-disable prettier/prettier */
import React, { useState, useCallback } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import supabase from "../supabaseClient";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";

const ProfileScreen = ({ navigation }) => {
  const [profileData, setProfileData] = useState(null);
  const { user } = useAuth();

  const fetchProfileData = useCallback(async () => {
    try {
      if (!user || !user.registrationId) {
        console.error("No authenticated user or registration ID found");
        return;
      }

      console.log("Fetching profile for registration_id:", user.registrationId);

      const { data: registrantData, error: registrantError } = await supabase
        .from("registrant")
        .select("*")
        .eq("registration_id", user.registrationId);

      console.log("Registrant data:", registrantData);
      console.log("Registrant error:", registrantError);

      if (!registrantData || registrantData.length === 0) {
        console.log(
          "No registrant found, creating basic profile from auth data"
        );
        setProfileData({
          name: user.fullName,
          email: user.email,
          registrationId: user.registrationId,
          address: null,
          contact: null,
          username: null,
          password: null,
          birthDate: null,
          civilStatus: null,
          education: null,
          businessNature: null,
          capitalization: null,
          sourceOfCapital: null,
          stallNo: null,
          stallLocation: null,
          stallDescription: null,
          spouseName: null,
          spouseBirthDate: null,
          spouseEducation: null,
          spouseOccupation: null,
          children: [],
        });
        return;
      }

      const { data, error } = await supabase
        .from("applicant")
        .select(
          `
      *,
      registrant!fk_applicant_registration (
        registration_id,
        full_name,
        address,
        contact_number,
        user_name,
        email,
        password
      ),
      stall (
        stall_no,
        stall_location,
        description,
        auction_date
      ),
      spouse_information (
        spouse_full_name,
        spouse_birth_date,
        spouse_educational_attainment,
        spouse_occupation,
        names_of_children
      )
    `
        )
        .eq("registration_id", user.registrationId);

      console.log("Applicant query result:", data);
      console.log("Applicant query error:", error);

      if (error) {
        console.error("Error fetching applicant profile:", error);
        const registrant = registrantData[0];
        setProfileData({
          registrant_id: registrant.id,
          name: registrant.full_name,
          address: registrant.address,
          contact: registrant.contact_number,
          username: registrant.user_name,
          email: registrant.email,
          password: registrant.password,
          birthDate: null,
          civilStatus: null,
          education: null,
          businessNature: null,
          capitalization: null,
          sourceOfCapital: null,
          stallNo: null,
          stallLocation: null,
          stallDescription: null,
          spouseName: null,
          spouseBirthDate: null,
          spouseEducation: null,
          spouseOccupation: null,
          children: [],
        });
        return;
      }

      if (data && data.length > 0) {
        const applicant = data[0];

        setProfileData({
          registrant_id: applicant.registrant?.id,
          name: applicant.registrant?.full_name || user.fullName,
          address: applicant.registrant?.address,
          contact: applicant.registrant?.contact_number,
          username: applicant.registrant?.user_name,
          email: applicant.registrant?.email || user.email,
          password: applicant.registrant?.password,

          birthDate: applicant.registrant_birth_date,
          civilStatus: applicant.registrant_civil_status,
          education: applicant.registrant_educational_attainment,
          businessNature: applicant.nature_of_business,
          capitalization: applicant.capitalization,
          sourceOfCapital: applicant.source_of_capital,

          stallNo: applicant.stall?.stall_no,
          stallLocation: applicant.stall?.stall_location,
          stallDescription: applicant.stall?.description,

          spouseName: applicant.spouse_information?.spouse_full_name,
          spouseBirthDate: applicant.spouse_information?.spouse_birth_date,
          spouseEducation:
            applicant.spouse_information?.spouse_educational_attainment,
          spouseOccupation: applicant.spouse_information?.spouse_occupation,
          children: applicant.spouse_information?.names_of_children || [],
        });
      } else {
        console.log("No applicant data found, using registrant data only");
        const registrant = registrantData[0];
        setProfileData({
          registrant_id: registrant.id,
          name: registrant.full_name,
          address: registrant.address,
          contact: registrant.contact_number,
          username: registrant.user_name,
          email: registrant.email,
          password: registrant.password,
          birthDate: null,
          civilStatus: null,
          education: null,
          businessNature: null,
          capitalization: null,
          sourceOfCapital: null,
          stallNo: null,
          stallLocation: null,
          stallDescription: null,
          spouseName: null,
          spouseBirthDate: null,
          spouseEducation: null,
          spouseOccupation: null,
          children: [],
        });
      }
    } catch (error) {
      console.error("Error in fetchProfileData:", error);
    }
  }, [user]); // Now fetchProfileData depends on user

  // Helper function to check if application data exists
  const hasApplicationData = () => {
    if (!profileData) return false;
    return !!(
      profileData.birthDate ||
      profileData.civilStatus ||
      profileData.education ||
      profileData.businessNature ||
      profileData.capitalization ||
      profileData.sourceOfCapital
    );
  };

  // Helper function to check if stall data exists
  const hasStallData = () => {
    if (!profileData) return false;
    return !!(
      profileData.stallNo ||
      profileData.stallLocation ||
      profileData.stallDescription
    );
  };

  // Helper function to check if spouse data exists
  const hasSpouseData = () => {
    if (!profileData) return false;
    return !!(
      profileData.spouseName ||
      profileData.spouseBirthDate ||
      profileData.spouseEducation ||
      profileData.spouseOccupation ||
      (profileData.children && profileData.children.length > 0)
    );
  };

  const NoDataMessage = ({ message = "No data found" }) => (
    <View style={styles.noDataContainer}>
      <Icon name="information-outline" size={24} color="#999" />
      <Text style={styles.noDataText}>{message}</Text>
    </View>
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchProfileData();
    }, [fetchProfileData])
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Please log in to view profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!profileData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {/* Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: "https://i.gifer.com/origin/c8/c8d864187433ac0cc77a5a2e057d52d4_w200.gif",
              }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.profileName}>{profileData.name}</Text>
          <Text style={styles.profileRole}>Satellite Market Stallholder</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate("Profile", {
                screen: "EditProfile",
                params: { profileData },
              })
            }
          >
            <Icon name="pencil" size={18} color="#ffffff" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Registration Information */}
        <View style={styles.infoCard}>
          <View style={styles.sectionHeader}>
            <Icon name="account-card-details" size={24} color="#3700b3" />
            <Text style={styles.sectionTitle}>Registration Information</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.value}>{profileData.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{profileData.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{profileData.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Contact Number:</Text>
            <Text style={styles.value}>{profileData.contact}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Username:</Text>
            <Text style={styles.value}>{profileData.username}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Password:</Text>
            <Text style={styles.value}>{"*".repeat(8)}</Text>
          </View>
        </View>

        {/* Application Information */}
        <View style={styles.infoCard}>
          <View style={styles.sectionHeader}>
            <Icon name="file-document" size={24} color="#3700b3" />
            <Text style={styles.sectionTitle}>Application Information</Text>
          </View>
          {hasApplicationData() ? (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Birth Date:</Text>
                <Text style={styles.value}>
                  {profileData.birthDate || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Civil Status:</Text>
                <Text style={styles.value}>
                  {profileData.civilStatus || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Educational Attainment:</Text>
                <Text style={styles.value}>
                  {profileData.education || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Nature of Business:</Text>
                <Text style={styles.value}>
                  {profileData.businessNature || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Capitalization:</Text>
                <Text style={styles.value}>
                  {profileData.capitalization
                    ? `₱${profileData.capitalization}`
                    : "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Source of Capital:</Text>
                <Text style={styles.value}>
                  {profileData.sourceOfCapital || "N/A"}
                </Text>
              </View>
            </>
          ) : (
            <NoDataMessage message="No application data found" />
          )}
        </View>

        {/* Stall Information */}
        <View style={styles.infoCard}>
          <View style={styles.sectionHeader}>
            <Icon name="store" size={24} color="#3700b3" />
            <Text style={styles.sectionTitle}>Stall Information</Text>
          </View>
          {hasStallData() ? (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Stall No:</Text>
                <Text style={styles.value}>{profileData.stallNo || "N/A"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Location:</Text>
                <Text style={styles.value}>
                  {profileData.stallLocation || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Description:</Text>
                <Text style={styles.value}>
                  {profileData.stallDescription || "N/A"}
                </Text>
              </View>
            </>
          ) : (
            <NoDataMessage message="No stall data found" />
          )}
        </View>

        {/* Spouse Information */}
        <View style={styles.infoCard}>
          <View style={styles.sectionHeader}>
            <Icon name="account-heart" size={24} color="#3700b3" />
            <Text style={styles.sectionTitle}>Spouse Information</Text>
          </View>
          {hasSpouseData() ? (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>
                  {profileData.spouseName || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Birth Date:</Text>
                <Text style={styles.value}>
                  {profileData.spouseBirthDate || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Education:</Text>
                <Text style={styles.value}>
                  {profileData.spouseEducation || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Occupation:</Text>
                <Text style={styles.value}>
                  {profileData.spouseOccupation || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Children:</Text>
                <Text style={styles.value}>
                  {profileData.children.length > 0
                    ? profileData.children.join(", ")
                    : "None"}
                </Text>
              </View>
            </>
          ) : (
            <NoDataMessage message="No spouse data found" />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  profileHeader: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  profileRole: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3700b3",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  editButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f1f3f4",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    flex: 1,
    marginRight: 10,
  },
  value: {
    fontSize: 14,
    color: "#333",
    flex: 2,
    textAlign: "right",
    flexWrap: "wrap",
  },
  noDataContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
  },
  noDataText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    marginLeft: 8,
  },
});

export default ProfileScreen;
